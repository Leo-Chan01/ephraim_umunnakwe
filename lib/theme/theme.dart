import 'package:flutter/material.dart';
import 'colors.dart';

final ThemeData customTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(
    seedColor: AppColors.primaryBlue,
    brightness: Brightness.dark,
  ),
  primaryColor: AppColors.primaryBlue,
  brightness: Brightness.dark,
  scaffoldBackgroundColor: AppColors.gradientStart,

  // Card Theme
  cardTheme: const CardThemeData(
    elevation: 8,
    shadowColor: Colors.black26,
    shape: RoundedRectangleBorder(
      borderRadius: BorderRadius.all(Radius.circular(16)),
    ),
    color: AppColors.cardGlass,
  ),

  // Button Themes
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      elevation: 8,
      shadowColor: Colors.black.withOpacity(0.3),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
      textStyle: const TextStyle(
        fontSize: 16,
        fontWeight: FontWeight.w600,
        fontFamily: 'Avenir',
      ),
    ),
  ),

  // Input Decoration
  inputDecorationTheme: InputDecorationTheme(
    filled: true,
    fillColor: AppColors.cardGlass,
    border: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: BorderSide.none,
    ),
    focusedBorder: OutlineInputBorder(
      borderRadius: BorderRadius.circular(12),
      borderSide: const BorderSide(color: AppColors.primaryBlue, width: 2),
    ),
    hintStyle: const TextStyle(
      fontSize: 16,
      fontFamily: 'Genome',
      color: AppColors.textMuted,
    ),
    labelStyle: const TextStyle(
      fontSize: 14,
      fontFamily: 'Genome',
      color: AppColors.textSecondary,
    ),
  ),

  // Enhanced Text Theme with better scaling
  textTheme: const TextTheme(
    // Headlines - for main titles
    headlineLarge: TextStyle(
      fontSize: 48,
      fontFamily: 'Avenir',
      fontWeight: FontWeight.bold,
      color: AppColors.textPrimary,
      height: 1.2,
    ),
    headlineMedium: TextStyle(
      fontSize: 36,
      fontFamily: 'Avenir',
      fontWeight: FontWeight.bold,
      color: AppColors.textPrimary,
      height: 1.2,
    ),
    headlineSmall: TextStyle(
      fontSize: 28,
      fontFamily: 'Avenir',
      fontWeight: FontWeight.w600,
      color: AppColors.textPrimary,
      height: 1.3,
    ),

    // Titles - for section headers
    titleLarge: TextStyle(
      fontSize: 24,
      fontFamily: 'Avenir',
      fontWeight: FontWeight.w600,
      color: AppColors.textPrimary,
      height: 1.3,
    ),
    titleMedium: TextStyle(
      fontSize: 20,
      fontFamily: 'Avenir',
      fontWeight: FontWeight.w500,
      color: AppColors.textSecondary,
      height: 1.4,
    ),
    titleSmall: TextStyle(
      fontSize: 18,
      fontFamily: 'Avenir',
      fontWeight: FontWeight.w500,
      color: AppColors.textSecondary,
      height: 1.4,
    ),

    // Body text - for content
    bodyLarge: TextStyle(
      fontSize: 18,
      fontFamily: 'Genome',
      fontWeight: FontWeight.normal,
      color: AppColors.textSecondary,
      height: 1.6,
    ),
    bodyMedium: TextStyle(
      fontSize: 16,
      fontFamily: 'Genome',
      fontWeight: FontWeight.normal,
      color: AppColors.textSecondary,
      height: 1.6,
    ),
    bodySmall: TextStyle(
      fontSize: 14,
      fontFamily: 'Genome',
      fontWeight: FontWeight.normal,
      color: AppColors.textMuted,
      height: 1.5,
    ),

    // Labels - for small text
    labelLarge: TextStyle(
      fontSize: 14,
      fontFamily: 'Genome',
      fontWeight: FontWeight.w500,
      color: AppColors.textSecondary,
    ),
    labelMedium: TextStyle(
      fontSize: 12,
      fontFamily: 'Genome',
      fontWeight: FontWeight.w500,
      color: AppColors.textMuted,
    ),
    labelSmall: TextStyle(
      fontSize: 10,
      fontFamily: 'Genome',
      fontWeight: FontWeight.w500,
      color: AppColors.textMuted,
    ),
  ),

  // App Bar Theme
  appBarTheme: const AppBarTheme(
    backgroundColor: Colors.transparent,
    elevation: 0,
    centerTitle: false,
    foregroundColor: AppColors.textPrimary,
    titleTextStyle: TextStyle(
      color: AppColors.textPrimary,
      fontWeight: FontWeight.w700,
      fontFamily: 'Avenir',
      fontSize: 24,
    ),
  ),
);
