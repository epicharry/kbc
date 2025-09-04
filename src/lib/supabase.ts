import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface GameRoom {
  id: string;
  room_code: string;
  host_id: string;
  status: 'waiting' | 'playing' | 'finished';
  current_question: number;
  created_at: string;
  max_players: number;
}

export interface Player {
  id: string;
  room_id: string;
  nickname: string;
  score: number;
  is_host: boolean;
  is_active: boolean;
  last_seen: string;
  created_at: string;
}

export interface PlayerAnswer {
  id: string;
  room_id: string;
  player_id: string;
  question_number: number;
  answer_index: number;
  is_correct: boolean;
  answered_at: string;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  player_id: string;
  player_nickname: string;
  message: string;
  created_at: string;
}

// Room Management
export const createRoom = async (hostNickname: string) => {
  const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const { data: room, error: roomError } = await supabase
    .from('game_rooms')
    .insert({
      room_code: roomCode,
      host_id: null, // Will be updated after player creation
      status: 'waiting',
      current_question: 0,
      max_players: 6
    })
    .select()
    .single();

  if (roomError) throw roomError;

  const { data: player, error: playerError } = await supabase
    .from('players')
    .insert({
      room_id: room.id,
      nickname: hostNickname,
      score: 0,
      is_host: true,
      is_active: true
    })
    .select()
    .single();

  if (playerError) throw playerError;

  // Update room with host_id
  await supabase
    .from('game_rooms')
    .update({ host_id: player.id })
    .eq('id', room.id);

  return { room: { ...room, host_id: player.id }, player };
};

export const joinRoom = async (roomCode: string, nickname: string) => {
  const { data: room, error: roomError } = await supabase
    .from('game_rooms')
    .select('*')
    .eq('room_code', roomCode.toUpperCase())
    .eq('status', 'waiting')
    .single();

  if (roomError) throw new Error('Room not found or already started');

  // Check if room is full
  const { count } = await supabase
    .from('players')
    .select('*', { count: 'exact', head: true })
    .eq('room_id', room.id)
    .eq('is_active', true);

  if (count && count >= room.max_players) {
    throw new Error('Room is full');
  }

  // Check if nickname is already taken
  const { data: existingPlayer } = await supabase
    .from('players')
    .select('*')
    .eq('room_id', room.id)
    .eq('nickname', nickname)
    .eq('is_active', true)
    .single();

  if (existingPlayer) {
    throw new Error('Nickname already taken in this room');
  }

  const { data: player, error: playerError } = await supabase
    .from('players')
    .insert({
      room_id: room.id,
      nickname,
      score: 0,
      is_host: false,
      is_active: true
    })
    .select()
    .single();

  if (playerError) throw playerError;

  return { room, player };
};

export const getRoomPlayers = async (roomId: string) => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .eq('room_id', roomId)
    .eq('is_active', true)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
};

export const submitAnswer = async (
  roomId: string,
  playerId: string,
  questionNumber: number,
  answerIndex: number,
  isCorrect: boolean
) => {
  console.log('Submitting answer:', { roomId, playerId, questionNumber, answerIndex, isCorrect });
  
  const { data, error } = await supabase
    .from('player_answers')
    .insert({
      room_id: roomId,
      player_id: playerId,
      question_number: questionNumber,
      answer_index: answerIndex,
      is_correct: isCorrect
    })
    .select()
    .single();

  if (error) throw error;
  console.log('Answer inserted successfully:', data);

  // Update player score if correct
  if (isCorrect) {
    console.log('Answer is correct, updating score...');
    const { data: currentPlayer } = await supabase
      .from('players')
      .select('score')
      .eq('id', playerId)
      .single();
    
    if (currentPlayer) {
      const { error: scoreError } = await supabase
        .from('players')
        .update({ score: currentPlayer.score + 1 })
        .eq('id', playerId);
        
      if (scoreError) {
        console.error('Error updating score:', scoreError);
      } else {
        console.log('Score updated successfully:', currentPlayer.score + 1);
      }
    }
  }

  return data;
};

export const getQuestionAnswers = async (roomId: string, questionNumber: number) => {
  const { data, error } = await supabase
    .from('player_answers')
    .select(`
      *,
      players (
        nickname
      )
    `)
    .eq('room_id', roomId)
    .eq('question_number', questionNumber);

  if (error) throw error;
  return data;
};

export const sendChatMessage = async (
  roomId: string,
  playerId: string,
  playerNickname: string,
  message: string
) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert({
      room_id: roomId,
      player_id: playerId,
      player_nickname: playerNickname,
      message: message.trim()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getChatMessages = async (roomId: string) => {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('room_id', roomId)
    .order('created_at', { ascending: true })
    .limit(50);

  if (error) throw error;
  return data;
};

export const updatePlayerLastSeen = async (playerId: string) => {
  await supabase
    .from('players')
    .update({ last_seen: new Date().toISOString() })
    .eq('id', playerId);
};

export const startGame = async (roomId: string) => {
  console.log('Starting game for room ID:', roomId);
  
  try {
    // First check if room exists and is in waiting status
    const { data: currentRoom, error: fetchError } = await supabase
      .from('game_rooms')
      .select('*')
      .eq('id', roomId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching room:', fetchError);
      throw new Error('Room not found');
    }
    
    if (currentRoom.status !== 'waiting') {
      throw new Error('Game has already started or finished');
    }
    
    console.log('Current room status:', currentRoom);
    
    // Check minimum players
    const { count: playerCount } = await supabase
      .from('players')
      .select('*', { count: 'exact', head: true })
      .eq('room_id', roomId)
      .eq('is_active', true);
      
    if (!playerCount || playerCount < 2) {
      throw new Error('Need at least 2 players to start');
    }
    
    console.log('Player count:', playerCount);
    
    // Update room status with explicit transaction
    const { data: updatedRoom, error: updateError } = await supabase
      .from('game_rooms')
      .update({ 
        status: 'playing',
        current_question: 1
      })
      .eq('id', roomId)
      .eq('status', 'waiting') // Ensure we only update if still waiting
      .select()
      .single();

    if (updateError) {
      console.error('Error starting game:', updateError);
      throw updateError;
    }
    
    if (!updatedRoom) {
      throw new Error('Failed to update room status - room may have already started');
    }
    
    console.log('Game started successfully:', updatedRoom);
    console.log('Updated room status:', updatedRoom.status);
    console.log('Updated current question:', updatedRoom.current_question);
    return updatedRoom;
    
  } catch (error) {
    console.error('Start game error:', error);
    throw error;
  }
};

export const nextQuestion = async (roomId: string, questionNumber: number) => {
  const { error } = await supabase
    .from('game_rooms')
    .update({ current_question: questionNumber })
    .eq('id', roomId);

  if (error) throw error;
};

export const endGame = async (roomId: string) => {
  const { error } = await supabase
    .from('game_rooms')
    .update({ status: 'finished' })
    .eq('id', roomId);

  if (error) throw error;
};