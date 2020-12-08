declare namespace Express {
  export interface Request {
    person: {
      id: string;
      role: string;
    };
  }
}
