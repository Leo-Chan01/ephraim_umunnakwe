// import 'package:bizboss/view_model/theme/colors.dart';
// import 'package:bizboss/view_model/theme/dimens.dart';
// import 'package:flutter/material.dart';
// import 'package:sizer/sizer.dart';

// final ThemeData lightTheme = ThemeData(
//   useMaterial3: true,
//   brightness: Brightness.light,
//   primaryColor: kPrimaryColor,
//   scaffoldBackgroundColor: Colors.white,
//   // accentColor: Colors.orange,
//   buttonTheme: const ButtonThemeData(
//     buttonColor: kPrimaryColor,
//     textTheme: ButtonTextTheme.primary,
//   ),
//   inputDecorationTheme: InputDecorationTheme(
//       border: const OutlineInputBorder(),
//       focusedBorder: const OutlineInputBorder(
//         borderSide: BorderSide(color: kPrimaryColor),
//       ),
//       hintStyle: TextStyle(fontSize: 16.sp, fontFamily: 'OpenSans'),
//       labelStyle: TextStyle(fontSize: 14.sp, fontFamily: 'OpenSans')),
//   textTheme: TextTheme(
//       //for web theming only
//       displayLarge: TextStyle(
//           fontSize: headerSizeMobileLeadingText.sp, fontFamily: 'OpenSans'),
//       displayMedium: TextStyle(
//           fontSize: headerSizeMobileLeadingText.sp, fontFamily: 'OpenSans'),
//       displaySmall: TextStyle(
//           fontSize: headerSizeMobileLeadingText.sp, fontFamily: 'OpenSans'),
//       //for mobile theming
//       headlineLarge: TextStyle(fontSize: 24.sp, fontFamily: 'OpenSans'),
//       headlineMedium: TextStyle(fontSize: 20.sp, fontFamily: 'OpenSans'),
//       headlineSmall: TextStyle(fontSize: 18.sp, fontFamily: 'OpenSans'),
//       titleLarge: TextStyle(fontSize: 16.sp, fontFamily: 'OpenSans'),
//       titleMedium: TextStyle(fontSize: 14.sp, fontFamily: 'OpenSans'),
//       titleSmall: TextStyle(fontSize: 12.sp, fontFamily: 'OpenSans'),
//       bodyLarge: TextStyle(fontSize: 14.sp, fontFamily: 'OpenSans'),
//       bodyMedium: TextStyle(fontSize: 12.sp, fontFamily: 'OpenSans'),
//       bodySmall: TextStyle(fontSize: 10.sp, fontFamily: 'OpenSans'),
//       labelLarge: TextStyle(fontSize: 12.sp, fontFamily: 'OpenSans'),
//       labelMedium: TextStyle(fontSize: 8.sp, fontFamily: 'OpenSans'),
//       labelSmall: TextStyle(fontSize: 4.sp, fontFamily: 'OpenSans')),
//   appBarTheme: AppBarTheme(
//       foregroundColor: Colors.white,
//       color: kPrimaryColor,
//       centerTitle: true,
//       elevation: 0,
//       titleTextStyle: TextStyle(
//           color: Colors.white,
//           fontWeight: FontWeight.w700,
//           fontSize: headerSizeMobileLeadingText.sp,
//           fontFamily: 'OpenSans')),
// );

// final ThemeData darkTheme = ThemeData(
//     useMaterial3: true,
//     brightness: Brightness.dark,
//     primaryColor: kPrimaryColorDark,
//     scaffoldBackgroundColor: kPrimaryColor,
//     buttonTheme: const ButtonThemeData(
//       buttonColor: Colors.yellow,
//       textTheme: ButtonTextTheme.primary,
//     ),
//     inputDecorationTheme: InputDecorationTheme(
//         border: const OutlineInputBorder(),
//         focusedBorder: const OutlineInputBorder(
//           borderSide: BorderSide(color: kTealColor),
//         ),
//         hintStyle: TextStyle(fontSize: 16.sp, fontFamily: 'OpenSans'),
//         labelStyle: TextStyle(fontSize: 14.sp, fontFamily: 'OpenSans')),
//     textTheme: TextTheme(
//         //for web theming only
//         displayLarge: TextStyle(
//             fontSize: headerSizeMobileLeadingText.sp, fontFamily: 'OpenSans'),
//         displayMedium: TextStyle(
//             fontSize: headerSizeMobileLeadingText.sp, fontFamily: 'OpenSans'),
//         displaySmall: TextStyle(
//             fontSize: headerSizeMobileLeadingText.sp, fontFamily: 'OpenSans'),
//         //for mobile theming
//         headlineLarge: TextStyle(fontSize: 24.sp, fontFamily: 'OpenSans'),
//         headlineMedium: TextStyle(fontSize: 20.sp, fontFamily: 'OpenSans'),
//         headlineSmall: TextStyle(fontSize: 18.sp, fontFamily: 'OpenSans'),
//         titleLarge: TextStyle(fontSize: 16.sp, fontFamily: 'OpenSans'),
//         titleMedium: TextStyle(fontSize: 14.sp, fontFamily: 'OpenSans'),
//         titleSmall: TextStyle(fontSize: 12.sp, fontFamily: 'OpenSans'),
//         bodyLarge: TextStyle(fontSize: 14.sp, fontFamily: 'OpenSans'),
//         bodyMedium: TextStyle(fontSize: 12.sp, fontFamily: 'OpenSans'),
//         bodySmall: TextStyle(fontSize: 10.sp, fontFamily: 'OpenSans'),
//         labelLarge: TextStyle(fontSize: 12.sp, fontFamily: 'OpenSans'),
//         labelMedium: TextStyle(fontSize: 8.sp, fontFamily: 'OpenSans'),
//         labelSmall: TextStyle(fontSize: 4.sp, fontFamily: 'OpenSans')),
//     appBarTheme: AppBarTheme(
//         foregroundColor: Colors.white,
//         color: kPrimaryColorDark,
//         centerTitle: true,
//         elevation: 0,
//         titleTextStyle: TextStyle(
//             color: Colors.white,
//             fontWeight: FontWeight.w700,
//             fontSize: headerSizeMobileLeadingText.sp,
//             fontFamily: 'OpenSans')),
//     dropdownMenuTheme: const DropdownMenuThemeData(
//         menuStyle: MenuStyle(
//             elevation: WidgetStatePropertyAll(0),
//             backgroundColor: WidgetStatePropertyAll(kTealColor),
//             surfaceTintColor: WidgetStatePropertyAll(kTealColor),
//             alignment: Alignment.center,
//             padding: WidgetStatePropertyAll(EdgeInsets.all(32)))));

// final ThemeData webThemeData = ThemeData(
//   useMaterial3: true,
//   brightness: Brightness.light,
//   primaryColor: kLightColorWeb,
//   primaryColorDark: kBackgroundGrey,
//   primaryColorLight: kLightColorWeb,
//   scaffoldBackgroundColor: kPrimaryColor,
//   buttonTheme: const ButtonThemeData(
//     buttonColor: Colors.yellow,
//     textTheme: ButtonTextTheme.primary,
//   ),
//   // primaryTextTheme: TextTheme(displayLarge: Tex),
//   inputDecorationTheme: const InputDecorationTheme(
//     border: OutlineInputBorder(),
//     focusedBorder: OutlineInputBorder(
//       borderSide: BorderSide(color: kTealColor),
//     ),
//   ),
//   textTheme: const TextTheme(
//     displayLarge: TextStyle(fontSize: 24.0, fontWeight: FontWeight.bold),
//     bodyLarge: TextStyle(fontSize: 14.0),
//   ),
//   // appBarTheme: const AppBarTheme(
//   //   color: kPrimaryColorDark,
//   // ),
// );

//   bool areWeDark(BuildContext context) {
//     var brightness = MediaQuery.of(context).platformBrightness;
//     var isDarkMode= brightness == Brightness.dark;
//     return isDarkMode;
//   }
