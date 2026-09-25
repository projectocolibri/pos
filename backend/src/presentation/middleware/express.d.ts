declare global {
  namespace Express {
    interface Request {
      nifEmpresa: string;
    }
  }
}

export {};
