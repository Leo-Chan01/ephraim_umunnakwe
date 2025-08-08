import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseConfig {
  static const String supabaseUrl = 'https://cecsvrwibdvncrxbbctr.supabase.co';
  static const String supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5'
      'cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlY3N2cndpYm'
      'R2bmNyeGJiY3RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MjA3ODEsI'
      'mV4cCI6MjA3MDA5Njc4MX0.dqSqaL37yCozA39pb61rnVzHmU0Jo_RH8vfisACAqS4';

  static SupabaseClient get client => Supabase.instance.client;

  static Future<void> initialize() async {
    await Supabase.initialize(
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    );
  }
}

class SupabaseTables {
  static const String projects = 'projects';
  static const String testimonials = 'testimonials';
  static const String socialLinks = 'social_links';
  static const String personalInfo = 'personal_info';
}
