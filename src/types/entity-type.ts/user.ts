export interface User {
  id: string;
  email: string;
  username: string;
}

export interface GroupChat {
  id: string;
  roomname: string;
}

export interface DirectMessage {
  id: string;
  members: {
    userId: string;
    user: {
      id: string;
      username: string;
    };
  }[];
}
