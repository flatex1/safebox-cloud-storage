// Define Liveblocks types for your application
// https://liveblocks.io/docs/api-reference/liveblocks-react#Typing-your-data
declare global {
  interface Liveblocks {
    // Each user's Presence, for useMyPresence, useOthers, etc.
    Presence: unknown;

    // The Storage tree for the room, for useMutation, useStorage, etc.
    Storage: unknown;

    // Custom user info set when authenticating with a secret key
    UserMeta: {
      id: string;
      info: {
        name: string;
        color: string;
        avatar: string;
        orgId: string;
      };
    };

    // Custom events, for useBroadcastEvent, useEventListener
    RoomEvent: unknown;
      // Example has two events, using a union
      // | { type: "PLAY" } 
      // | { type: "REACTION"; emoji: "🔥" };

    // Custom metadata set on threads, for useThreads, useCreateThread, etc.
    ThreadMetadata: unknown;

    // Custom room info set with resolveRoomsInfo, for useRoomInfo
    RoomInfo: unknown;
  }
}

export {};
