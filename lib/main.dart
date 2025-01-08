import 'package:ephraim_umunnakwe/pages/web/routes/app_routes.dart';
import 'package:ephraim_umunnakwe/theme/theme.dart';
import 'package:ephraim_umunnakwe/view_models/providers/gradient_notifier.dart';
import 'package:ephraim_umunnakwe/view_models/providers/projects_provider.dart';
import 'package:ephraim_umunnakwe/view_models/providers/site_state_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:provider/provider.dart';

Future<void> main() async {
  // usePath();
  // GoRouter.optionURLReflectsImperativeAPIs = true;
  WidgetsFlutterBinding.ensureInitialized();

  runApp(MultiProvider(providers: [
    ChangeNotifierProvider<ProjectsProvider>(
        create: (context) => ProjectsProvider()),
    ChangeNotifierProvider<SiteStateProvider>(
        create: (context) => SiteStateProvider()),
    ChangeNotifierProvider<GradientNotifier>(
        create: (context) => GradientNotifier())
  ], child: const MyApp()));
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
        designSize: const Size(1920, 800),
        minTextAdapt: true,
        splitScreenMode: false,
        ensureScreenSize: true,
        builder: (context, child) {
          return MaterialApp.router(
           
            debugShowCheckedModeBanner: false,
            title: 'Ephraim Umunnakwe',
            theme: customTheme,
            routerConfig: AppRoutes.router,
          );
        });
  }
}
