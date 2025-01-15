const mockAdmins = [];

const mockPool = {
  query: async (query, values) => {
    if (query.startsWith('INSERT INTO admins')) {
      const newAdmin = {
        id: mockAdmins.length + 1,
        username: values[0],
        password: values[1],
        confirm_password: values[2],
        email: values[3],
        safeword: values[4],
      };
      mockAdmins.push(newAdmin);
      return { rows: [newAdmin] };
    }
    if (query.startsWith('SELECT * FROM admins')) {
      return { rows: mockAdmins.filter(admin => admin.username === values[0]) };
    }
    throw new Error('Query not recognized');
  },
  end: async () => {
    console.log('Mock database connection closed.');
  },
};

module.exports = mockPool;
