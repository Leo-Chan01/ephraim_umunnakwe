import 'package:supabase_flutter/supabase_flutter.dart';
import '../services/supabase_config.dart';

class AuthService {
  static final SupabaseClient _client = SupabaseConfig.client;

  // Check if user is logged in
  static bool get isLoggedIn => _client.auth.currentUser != null;

  // Get current user
  static User? get currentUser => _client.auth.currentUser;

  // Sign in with email and password
  static Future<AuthResponse> signIn(String email, String password) async {
    return await _client.auth.signInWithPassword(
      email: email,
      password: password,
    );
  }

  // Sign up with email and password
  static Future<AuthResponse> signUp(String email, String password) async {
    return await _client.auth.signUp(
      email: email,
      password: password,
    );
  }

  // Sign out
  static Future<void> signOut() async {
    await _client.auth.signOut();
  }

  // Listen to auth state changes
  static Stream<AuthState> get authStateChanges =>
      _client.auth.onAuthStateChange;
}
