class authService {
  async login(username: string, password: string) {
    // Call db from respository to check if user exists
    throw { status: 501, code: "NOT_IMPLEMENTED", message: "Not implemented" };
  }

  async register(
    username: string,
    password: string,
    email: string,
    avatar?: string
  ) {
    // Call db from respository to create a new user
    throw { status: 501, code: "NOT_IMPLEMENTED", message: "Not implemented" };
  }
}

export default new authService();
