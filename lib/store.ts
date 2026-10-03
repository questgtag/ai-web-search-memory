import fs from 'fs';
import path from 'path';

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type MemoryRecord = {
  id: string;
  userId: string;
  topic: string;
  content: string;
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const MEMORY_FILE = path.join(DATA_DIR, 'memories.json');

async function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, '[]', 'utf-8');
  }
  if (!fs.existsSync(MEMORY_FILE)) {
    fs.writeFileSync(MEMORY_FILE, '[]', 'utf-8');
  }
}

export async function readUsers(): Promise<UserRecord[]> {
  await ensureStore();
  const raw = fs.readFileSync(USERS_FILE, 'utf-8');
  return JSON.parse(raw || '[]');
}

export async function writeUsers(users: UserRecord[]) {
  await ensureStore();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export async function readMemories(): Promise<MemoryRecord[]> {
  await ensureStore();
  const raw = fs.readFileSync(MEMORY_FILE, 'utf-8');
  return JSON.parse(raw || '[]');
}

export async function writeMemories(memories: MemoryRecord[]) {
  await ensureStore();
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memories, null, 2), 'utf-8');
}

export async function createUser(user: UserRecord) {
  const users = await readUsers();
  users.push(user);
  await writeUsers(users);
}

export async function getUserByEmail(email: string) {
  const users = await readUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function getUserProfile(userId: string) {
  const users = await readUsers();
  return users.find((user) => user.id === userId) ?? null;
}

export async function getUserMemories(userId: string): Promise<MemoryRecord[]> {
  const memories = await readMemories();
  return memories.filter((memory) => memory.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function saveUserMemory(userId: string, topic: string, content: string) {
  const memories = await readMemories();
  const newMemory: MemoryRecord = {
    id: crypto.randomUUID(),
    userId,
    topic,
    content,
    createdAt: new Date().toISOString(),
  };
  memories.unshift(newMemory);
  await writeMemories(memories);
  return newMemory;
}
