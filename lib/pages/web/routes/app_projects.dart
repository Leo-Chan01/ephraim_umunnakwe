import 'package:ephraim_umunnakwe/pages/web/widgets/custom_icon_widget.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/gradient_container.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class AppProjects extends StatelessWidget {
  const AppProjects({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientContainer(
        child: Center(
            child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "App Projects",
                style: Theme.of(context)
                    .textTheme
                    .headlineLarge!
                    .copyWith(color: Colors.white, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              Text(
                "Explore my expanding gallery of work, published and unpublished, "
                "click on each to view little details about them, or go straight to installation",
                style: Theme.of(context)
                    .textTheme
                    .titleLarge!
                    .copyWith(color: Colors.white, fontFamily: 'Genome'),
              ),
              const SizedBox(height: 40),
              Expanded(
                  child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3),
                itemCount: 5,
                padding: const EdgeInsets.all(22),
                itemBuilder: (context, index) {
                  return Card(
                    elevation: 0,
                    margin: const EdgeInsets.all(22),
                    child: Column(
                      children: [
                        Expanded(
                          flex: 10,
                          child: Row(
                            children: [
                              Expanded(
                                flex: 5,
                                child: ClipRRect(
                                    borderRadius: BorderRadius.circular(10),
                                    child: Image.asset(
                                      "assets/images/profile_img.jpg",
                                      fit: BoxFit.cover,
                                    )),
                              ),
                              const Expanded(
                                flex: 1,
                                child: Padding(
                                  padding: EdgeInsets.all(8.0),
                                  child: Column(
                                    children: [
                                      Flexible(
                                        child: CustomIconWidget(
                                          icon: FontAwesomeIcons.android,
                                          color: Colors.green,
                                          radius: 100,
                                        ),
                                      ),
                                      SizedBox(height: 10),
                                      Flexible(
                                        child: CustomIconWidget(
                                          icon: FontAwesomeIcons.googlePlay,
                                          color: Colors.grey,
                                          radius: 100,
                                        ),
                                      ),
                                      SizedBox(height: 10),
                                      Flexible(
                                        child: CustomIconWidget(
                                          icon: FontAwesomeIcons.globe,
                                          color: Colors.blue,
                                          radius: 100,
                                        ),
                                      ),
                                      SizedBox(height: 10),
                                      Flexible(
                                        child: CustomIconWidget(
                                          icon: FontAwesomeIcons.code,
                                          color: Colors.black,
                                          radius: 100,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              )
                            ],
                          ),
                        ),
                        const SizedBox(height: 20),
                        Expanded(
                            flex: 1,
                            child: Text(
                              "Azaman",
                              style: Theme.of(context)
                                  .textTheme
                                  .bodyLarge!
                                  .copyWith(
                                      fontWeight: FontWeight.bold,
                                      fontFamily: 'Avenir'),
                            )),
                        Expanded(
                            flex: 4,
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Container(
                                  width: double.infinity,
                                  decoration: BoxDecoration(
                                      border: Border.all(
                                          color: Colors.grey, width: 2),
                                      borderRadius: BorderRadius.circular(10)),
                                  child: const Padding(
                                    padding: EdgeInsets.all(8.0),
                                    child: Text("This is a FintTech App"),
                                  )),
                            )),
                      ],
                    ),
                  );
                },
              ))
            ],
          ),
        )),
      ),
    );
  }
}
