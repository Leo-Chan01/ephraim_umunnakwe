import 'package:ephraim_umunnakwe/pages/web/widgets/gradient_container.dart';
import 'package:flutter/material.dart';

class ApiProjects extends StatelessWidget {
  const ApiProjects({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: GradientContainer(
        child: Center(child: Text("My API Projects")),
      ),
    );
  }
}
