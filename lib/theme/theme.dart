import 'package:flutter/material.dart';

final ThemeData customTheme = ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
  primaryColor: const Color.fromRGBO(8, 0, 41, 1),
  brightness: Brightness.light,
  // primaryColor: ColorScheme.fromSeed(seedColor: seedColor),
  scaffoldBackgroundColor: Colors.white,
  // accentColor: Colors.orange,
  buttonTheme: const ButtonThemeData(
    // buttonColor: kPrimaryColor,
    textTheme: ButtonTextTheme.primary,
  ),
  inputDecorationTheme: const InputDecorationTheme(
      border: OutlineInputBorder(),
      focusedBorder: OutlineInputBorder(
          // borderSide: BorderSide(color: kPrimaryColor),
          ),
      hintStyle: TextStyle(fontSize: 16, fontFamily: 'Genome'),
      labelStyle: TextStyle(fontSize: 14, fontFamily: 'Genome')),
  textTheme: const TextTheme(
      //for mobile theming
      headlineLarge: TextStyle(fontSize: 24, fontFamily: 'Avenir'),
      headlineMedium: TextStyle(fontSize: 20, fontFamily: 'Avenir'),
      headlineSmall: TextStyle(fontSize: 18, fontFamily: 'Avenir'),
      titleLarge: TextStyle(fontSize: 16, fontFamily: 'Avenir'),
      titleMedium: TextStyle(fontSize: 14, fontFamily: 'Avenir'),
      titleSmall: TextStyle(fontSize: 12, fontFamily: 'Avenir'),
      bodyLarge: TextStyle(fontSize: 16, fontFamily: 'Genome'),
      bodyMedium: TextStyle(fontSize: 14, fontFamily: 'Genome'),
      bodySmall: TextStyle(fontSize: 10, fontFamily: 'Genome'),
      labelLarge: TextStyle(fontSize: 12, fontFamily: 'Genome'),
      labelMedium: TextStyle(fontSize: 8, fontFamily: 'Genome'),
      labelSmall: TextStyle(fontSize: 4, fontFamily: 'Genome')),
  appBarTheme: const AppBarTheme(
      foregroundColor: Colors.white,
      centerTitle: true,
      elevation: 0,
      titleTextStyle: TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w700,
          fontFamily: 'Avenir')),
);
