import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/admin_provider.dart';
import 'screens/dashboard_screen.dart';
import 'theme/admin_theme.dart';

void main() {
  runApp(const PortfolioAdminApp());
}

class PortfolioAdminApp extends StatelessWidget {
  const PortfolioAdminApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AdminProvider()),
      ],
      child: MaterialApp(
        title: 'Portfolio Admin Dashboard',
        theme: AdminTheme.lightTheme,
        darkTheme: AdminTheme.darkTheme,
        themeMode: ThemeMode.system,
        debugShowCheckedModeBanner: false,
        home: const DashboardScreen(),
      ),
    );
  }
}
