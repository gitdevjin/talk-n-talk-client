export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Chat {
  id: string;
  roomname: string;
  isGroup: boolean;
}

export interface GroupChat extends Chat {
  isGroup: true;
  // could add group-specific fields later
}

export interface DirectMessage extends Chat {
  isGroup: false;
  members: {
    userId: string;
    user: {
      id: string;
      username: string;
    };
  }[];
}
