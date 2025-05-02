import { api } from '@/lib/api';
import { UserRole } from '@/lib/roles';

export type SocialProvider = 'google' | 'facebook' | null;

export type DummyUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phoneNumber: string;
  address: string;
  dateOfBirth: string;
  walletId?: string;
  walletBalance?: number;
  socialProvider?: SocialProvider;
  socialId?: string;
  profilePicture?: string;
};

// Store created test users for later cleanup
let createdTestUsers: DummyUser[] = [];

/**
 * Creates a dummy user for testing purposes
 * @param role The role to assign to the user
 * @param options Additional options for the user
 * @returns The created user
 */
export async function createDummyUser(
  role: UserRole = UserRole.MEMBER,
  options: Partial<DummyUser> = {}
): Promise<DummyUser> {
  // Generate a unique email to avoid conflicts
  const timestamp = new Date().getTime();
  const randomSuffix = Math.floor(Math.random() * 10000);

  const defaultUser = {
    email: `test-${timestamp}-${randomSuffix}@example.com`,
    firstName: 'Test',
    lastName: 'User',
    role,
    phoneNumber: '+1234567890',
    address: '123 Test Street, Test City',
    dateOfBirth: '1990-01-01',
    password: 'Password123!',
    ...options
  };

  try {
    // Call the API to create the user
    const response = await api.createUser(defaultUser);

    // Store the created user for later cleanup
    const createdUser = {
      id: response.data.id,
      email: defaultUser.email,
      firstName: defaultUser.firstName,
      lastName: defaultUser.lastName,
      role: defaultUser.role,
      phoneNumber: defaultUser.phoneNumber,
      address: defaultUser.address,
      dateOfBirth: defaultUser.dateOfBirth,
      socialProvider: options.socialProvider || null,
      socialId: options.socialId,
      profilePicture: options.profilePicture,
    };

    createdTestUsers.push(createdUser);

    console.log(`Created test user: ${createdUser.email}`);
    return createdUser;
  } catch (error) {
    console.error('Failed to create test user:', error);
    throw error;
  }
}

/**
 * Creates a dummy Google user for testing purposes
 * @param role The role to assign to the user
 * @param options Additional options for the user
 * @returns The created user
 */
export async function createDummyGoogleUser(
  role: UserRole = UserRole.MEMBER,
  options: Partial<DummyUser> = {}
): Promise<DummyUser> {
  // Generate a unique Google ID and email
  const timestamp = new Date().getTime();
  const randomSuffix = Math.floor(Math.random() * 10000);
  const googleId = `google-${timestamp}-${randomSuffix}`;
  const email = `test-${timestamp}-${randomSuffix}@gmail.com`;

  try {
    // Call the API to create a user with Google credentials
    const response = await api.createSocialUser({
      provider: 'google',
      socialId: googleId,
      email,
      firstName: options.firstName || 'Google',
      lastName: options.lastName || 'User',
      profilePicture: options.profilePicture || 'https://lh3.googleusercontent.com/a/default-user',
      role: role,
    });

    // Store the created user for later cleanup
    const createdUser = {
      id: response.data.id,
      email,
      firstName: options.firstName || 'Google',
      lastName: options.lastName || 'User',
      role,
      phoneNumber: options.phoneNumber || '+1234567890',
      address: options.address || '123 Test Street, Test City',
      dateOfBirth: options.dateOfBirth || '1990-01-01',
      socialProvider: 'google',
      socialId: googleId,
      profilePicture: options.profilePicture || 'https://lh3.googleusercontent.com/a/default-user',
    };

    createdTestUsers.push(createdUser);

    console.log(`Created test Google user: ${createdUser.email}`);
    return createdUser;
  } catch (error) {
    console.error('Failed to create test Google user:', error);
    throw error;
  }
}

/**
 * Creates a dummy Facebook user for testing purposes
 * @param role The role to assign to the user
 * @param options Additional options for the user
 * @returns The created user
 */
export async function createDummyFacebookUser(
  role: UserRole = UserRole.MEMBER,
  options: Partial<DummyUser> = {}
): Promise<DummyUser> {
  // Generate a unique Facebook ID and email
  const timestamp = new Date().getTime();
  const randomSuffix = Math.floor(Math.random() * 10000);
  const facebookId = `facebook-${timestamp}-${randomSuffix}`;
  const email = `test-${timestamp}-${randomSuffix}@facebook.com`;

  try {
    // Call the API to create a user with Facebook credentials
    const response = await api.createSocialUser({
      provider: 'facebook',
      socialId: facebookId,
      email,
      firstName: options.firstName || 'Facebook',
      lastName: options.lastName || 'User',
      profilePicture: options.profilePicture || 'https://graph.facebook.com/default-user/picture',
      role: role,
    });

    // Store the created user for later cleanup
    const createdUser = {
      id: response.data.id,
      email,
      firstName: options.firstName || 'Facebook',
      lastName: options.lastName || 'User',
      role,
      phoneNumber: options.phoneNumber || '+1234567890',
      address: options.address || '123 Test Street, Test City',
      dateOfBirth: options.dateOfBirth || '1990-01-01',
      socialProvider: 'facebook',
      socialId: facebookId,
      profilePicture: options.profilePicture || 'https://graph.facebook.com/default-user/picture',
    };

    createdTestUsers.push(createdUser);

    console.log(`Created test Facebook user: ${createdUser.email}`);
    return createdUser;
  } catch (error) {
    console.error('Failed to create test Facebook user:', error);
    throw error;
  }
}

/**
 * Creates a dummy user with an E-Wallet
 * @param initialBalance The initial balance for the wallet
 * @param options Additional options for the user
 * @returns The created user with wallet information
 */
export async function createDummyEWalletUser(
  initialBalance: number = 0,
  options: Partial<DummyUser> = {}
): Promise<DummyUser> {
  try {
    // Create a regular user first
    const user = await createDummyUser(UserRole.MEMBER, options);

    // Create an E-Wallet for the user
    const walletResponse = await api.createEWallet({
      userId: user.id,
      initialBalance
    });

    const userWithWallet = {
      ...user,
      walletId: walletResponse.data.walletId,
      walletBalance: initialBalance
    };

    // Update the stored user with wallet information
    createdTestUsers = createdTestUsers.map(u =>
      u.id === user.id ? userWithWallet : u
    );

    console.log(`Created E-Wallet for test user: ${user.email}`);
    return userWithWallet;
  } catch (error) {
    console.error('Failed to create test E-Wallet user:', error);
    throw error;
  }
}

/**
 * Creates a dummy Google user with an E-Wallet
 * @param initialBalance The initial balance for the wallet
 * @param options Additional options for the user
 * @returns The created user with wallet information
 */
export async function createDummyGoogleEWalletUser(
  initialBalance: number = 0,
  options: Partial<DummyUser> = {}
): Promise<DummyUser> {
  try {
    // Create a Google user first
    const user = await createDummyGoogleUser(UserRole.MEMBER, options);

    // Create an E-Wallet for the user
    const walletResponse = await api.createEWallet({
      userId: user.id,
      initialBalance
    });

    const userWithWallet = {
      ...user,
      walletId: walletResponse.data.walletId,
      walletBalance: initialBalance
    };

    // Update the stored user with wallet information
    createdTestUsers = createdTestUsers.map(u =>
      u.id === user.id ? userWithWallet : u
    );

    console.log(`Created E-Wallet for test Google user: ${user.email}`);
    return userWithWallet;
  } catch (error) {
    console.error('Failed to create test Google E-Wallet user:', error);
    throw error;
  }
}

/**
 * Creates a dummy Facebook user with an E-Wallet
 * @param initialBalance The initial balance for the wallet
 * @param options Additional options for the user
 * @returns The created user with wallet information
 */
export async function createDummyFacebookEWalletUser(
  initialBalance: number = 0,
  options: Partial<DummyUser> = {}
): Promise<DummyUser> {
  try {
    // Create a Facebook user first
    const user = await createDummyFacebookUser(UserRole.MEMBER, options);

    // Create an E-Wallet for the user
    const walletResponse = await api.createEWallet({
      userId: user.id,
      initialBalance
    });

    const userWithWallet = {
      ...user,
      walletId: walletResponse.data.walletId,
      walletBalance: initialBalance
    };

    // Update the stored user with wallet information
    createdTestUsers = createdTestUsers.map(u =>
      u.id === user.id ? userWithWallet : u
    );

    console.log(`Created E-Wallet for test Facebook user: ${user.email}`);
    return userWithWallet;
  } catch (error) {
    console.error('Failed to create test Facebook E-Wallet user:', error);
    throw error;
  }
}

/**
 * Creates multiple dummy users at once
 * @param count Number of users to create
 * @param options Options for the batch creation
 * @returns Array of created users
 */
export async function createBatchUsers(
  count: number,
  options: {
    role?: UserRole;
    withEWallet?: boolean;
    initialBalance?: number;
    socialProvider?: SocialProvider;
  } = {}
): Promise<DummyUser[]> {
  const {
    role = UserRole.MEMBER,
    withEWallet = false,
    initialBalance = 0,
    socialProvider = null
  } = options;

  const batchUsers: DummyUser[] = [];

  try {
    for (let i = 0; i < count; i++) {
      let user: DummyUser;

      // Create user based on options
      if (socialProvider === 'google') {
        if (withEWallet) {
          user = await createDummyGoogleEWalletUser(initialBalance, { role });
        } else {
          user = await createDummyGoogleUser(role);
        }
      } else if (socialProvider === 'facebook') {
        if (withEWallet) {
          user = await createDummyFacebookEWalletUser(initialBalance, { role });
        } else {
          user = await createDummyFacebookUser(role);
        }
      } else {
        if (withEWallet) {
          user = await createDummyEWalletUser(initialBalance, { role });
        } else {
          user = await createDummyUser(role);
        }
      }

      batchUsers.push(user);
    }

    console.log(`Created ${count} test users in batch`);
    return batchUsers;
  } catch (error) {
    console.error('Failed to create batch test users:', error);
    throw error;
  }
}

/**
 * Cleans up all created test users
 */
export async function cleanupTestUsers(): Promise<void> {
  const userIds = createdTestUsers.map(user => user.id);

  if (userIds.length === 0) {
    console.log('No test users to clean up');
    return;
  }

  try {
    // Delete all created test users
    await Promise.all(
      userIds.map(id => api.deleteUser(id))
    );

    console.log(`Cleaned up ${userIds.length} test users`);
    createdTestUsers = [];
  } catch (error) {
    console.error('Failed to clean up test users:', error);
    throw error;
  }
}

/**
 * Deletes a specific test user
 * @param userId ID of the user to delete
 */
export async function deleteTestUser(userId: number): Promise<void> {
  try {
    await api.deleteUser(userId);

    // Remove from our local array
    createdTestUsers = createdTestUsers.filter(user => user.id !== userId);

    console.log(`Deleted test user with ID: ${userId}`);
  } catch (error) {
    console.error(`Failed to delete test user with ID ${userId}:`, error);
    throw error;
  }
}

/**
 * Gets all created test users
 */
export function getCreatedTestUsers(): DummyUser[] {
  return [...createdTestUsers];
}

/**
 * Gets a specific test user by ID
 * @param userId ID of the user to get
 */
export function getTestUserById(userId: number): DummyUser | undefined {
  return createdTestUsers.find(user => user.id === userId);
}

/**
 * Export test users to JSON
 */
export function exportTestUsers(): string {
  return JSON.stringify(createdTestUsers);
}

/**
 * Import test users from JSON
 * @param jsonData JSON string containing test users
 */
export function importTestUsers(jsonData: string): DummyUser[] {
  try {
    const importedUsers = JSON.parse(jsonData) as DummyUser[];

    // Add imported users to our array, avoiding duplicates
    importedUsers.forEach(user => {
      if (!createdTestUsers.some(existingUser => existingUser.id === user.id)) {
        createdTestUsers.push(user);
      }
    });

    return [...createdTestUsers];
  } catch (error) {
    console.error('Failed to import test users:', error);
    throw error;
  }
}
