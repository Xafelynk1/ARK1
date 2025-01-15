const mockAdmins = [];
const mockUsers = [];

const mockPool = {
    query: async (query, values) => {
        if (query.startsWith('INSERT INTO users')) {
            const newUser = {
                id: mockUsers.length + 1,
                username: values[0],
                password: values[1],
                surname: values[2],
                email: values[3],
                dob: values[4],
                role: 'user' // Default role
            };
            mockUsers.push(newUser);
            return { rows: [newUser] };
        }
        if (query.startsWith('SELECT * FROM users')) {
            return { rows: mockUsers.filter(user => user.username === values[0]) };
        }
        if (query.startsWith('UPDATE "users" SET role')) {
            const username = values[1];
            const user = mockUsers.find(user => user.username === username);
            if (user) {
                user.role = values[0]; // Update the user's role
                return { rows: [user] };
            }
            return { rowCount: 0 };
        }
        if (query.startsWith('DELETE FROM users')) {
            const index = mockUsers.findIndex(user => user.username === values[0]);
            if (index !== -1) {
                const removedUser = mockUsers.splice(index, 1);
                return { rowCount: removedUser.length, rows: removedUser };
            }
            return { rowCount: 0 };
        }
        throw new Error('Query not recognized');
    },
    end: async () => {
        // Mock end function
    }
};

module.exports = mockPool;
