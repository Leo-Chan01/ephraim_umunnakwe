import 'package:ephraim_umunnakwe/pages/web/widgets/custom_icon_widget.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/expanding_text_widget.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/gradient_container.dart';
import 'package:ephraim_umunnakwe/utils/util_methods.dart';
import 'package:ephraim_umunnakwe/view_models/providers/projects_provider.dart';
import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';

class AppProjects extends StatefulWidget {
  const AppProjects({super.key});

  @override
  State<AppProjects> createState() => _AppProjectsState();
}

class _AppProjectsState extends State<AppProjects> {
  @override
  void initState() {
    super.initState();
    getAllProjectList();
  }

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
              SelectableText(
                "App Projects",
                style: Theme.of(context)
                    .textTheme
                    .headlineLarge!
                    .copyWith(color: Colors.white, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 20),
              SelectableText(
                "Explore my expanding gallery of work, published and unpublished, "
                "click on each to view little details about them, or go straight to installation",
                style: Theme.of(context)
                    .textTheme
                    .titleLarge!
                    .copyWith(color: Colors.white, fontFamily: 'Genome'),
              ),
              const SizedBox(height: 40),
              context.watch<ProjectsProvider>().isLoading
                  ? Center(child: CustomLoadingWidget())
                  : Expanded(
                      child: GridView.builder(
                      gridDelegate:
                          const SliverGridDelegateWithFixedCrossAxisCount(
                              // crossAxisCount: _getCrossAxisCount(context),
                              crossAxisCount: 2,
                              childAspectRatio: 0.75,
                              crossAxisSpacing: 16,
                              mainAxisSpacing: 16),
                      itemCount:
                          context.watch<ProjectsProvider>().projects.length,
                      padding: const EdgeInsets.all(22),
                      physics: const BouncingScrollPhysics(),
                      itemBuilder: (context, index) {
                        var project = Provider.of<ProjectsProvider>(context,
                                listen: false)
                            .projects[index];
                        return Card(
                          elevation: 0,
                          child: Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Column(
                              children: [
                                Padding(
                                  padding: EdgeInsets.all(8.sp),
                                  child: Row(
                                    children: [
                                      Expanded(
                                        flex: 5,
                                        child: Column(
                                          children: [
                                            ClipRRect(
                                                borderRadius:
                                                    BorderRadius.circular(10),
                                                child: Image.asset(
                                                  "assets/images/profile_img.jpg",
                                                  fit: BoxFit.cover,
                                                )),
                                            const SizedBox(height: 20),
                                            Align(
                                              alignment: Alignment.centerLeft,
                                              child: SelectableText(
                                                project.name ?? "N/A",
                                                textAlign: TextAlign.start,
                                                style: Theme.of(context)
                                                    .textTheme
                                                    .bodyLarge!
                                                    .copyWith(
                                                        fontWeight:
                                                            FontWeight.bold,
                                                        fontFamily: 'Avenir'),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                      const Expanded(
                                        flex: 1,
                                        child: Padding(
                                          padding: EdgeInsets.all(8.0),
                                          child: Column(
                                            children: [
                                              CustomIconWidget(
                                                icon:
                                                    FontAwesomeIcons.googlePlay,
                                                color: Colors.green,
                                                radius: 100,
                                              ),
                                              SizedBox(height: 10),
                                              CustomIconWidget(
                                                icon: FontAwesomeIcons.appStore,
                                                color: Colors.grey,
                                                radius: 100,
                                              ),
                                              SizedBox(height: 10),
                                              CustomIconWidget(
                                                icon: FontAwesomeIcons.globe,
                                                color: Colors.blue,
                                                radius: 100,
                                              ),
                                              SizedBox(height: 10),
                                              CustomIconWidget(
                                                icon: FontAwesomeIcons.code,
                                                color: Colors.black,
                                                radius: 100,
                                              ),
                                            ],
                                          ),
                                        ),
                                      )
                                    ],
                                  ),
                                ),
                                const SizedBox(height: 15),
                                Container(
                                    width: double.infinity,
                                    decoration: BoxDecoration(
                                        border: Border.all(
                                            color: Colors.grey, width: 2),
                                        borderRadius:
                                            BorderRadius.circular(10)),
                                    child: Padding(
                                      padding: const EdgeInsets.all(8.0),
                                      child: Text("See more details",
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodySmall!
                                              .copyWith(
                                                  color: Colors.black,
                                                  fontFamily: 'Avenir')),
                                      // child: ExpandingTextWidget(
                                      //     truncationLength: 50,
                                      //     text:
                                      //         project.description ?? 'N/A',
                                      //     widgetStyle: Theme.of(context)
                                      //         .textTheme
                                      //         .bodySmall!
                                      //         .copyWith(
                                      //             color: Colors.black,
                                      //             fontFamily: 'Avenir')),
                                    )),
                                const SizedBox(height: 15),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Align(
                                      alignment: Alignment.centerLeft,
                                      child: RichText(
                                        text: TextSpan(
                                          text: "Status: ",
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodySmall,
                                          children: [
                                            TextSpan(
                                              text: project.status,
                                              style: TextStyle(
                                                  color: project.status ==
                                                          "In Progress"
                                                      ? Colors.orange
                                                      : project.status ==
                                                              "Planning"
                                                          ? Colors.blue
                                                          : project.status ==
                                                                  "Completed"
                                                              ? Colors.green
                                                              : Colors.black,
                                                  fontWeight: FontWeight.w900),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                    const SizedBox(height: 10),
                                    Wrap(
                                      spacing: 8.0,
                                      runSpacing: 4.0,
                                      children: project.technologies!
                                          .map<Widget>((tech) {
                                        return Chip(
                                          label: Text(tech),
                                          backgroundColor: Colors.blueAccent,
                                          side: BorderSide.none,
                                          labelStyle: const TextStyle(
                                              color: Colors.white),
                                        );
                                      }).toList(),
                                    ),
                                    const SizedBox(height: 10),
                                    // Use the start and end date to get the duration in months
                                    Align(
                                      alignment: Alignment.centerLeft,
                                      child: RichText(
                                        text: TextSpan(
                                          text: "Duration: ",
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodySmall,
                                          children: [
                                            TextSpan(
                                              text:
                                                  " ${calculateDurationInMonths(project.startDate, project.endDate)} months.",
                                              style: const TextStyle(
                                                  color: Colors.black,
                                                  fontWeight: FontWeight.w900),
                                            ),
                                          ],
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
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

  Future<void> getAllProjectList() async {
    await Provider.of<ProjectsProvider>(context, listen: false).fetchProjects();
  }

  int _getCrossAxisCount(BuildContext context) {
    double width = MediaQuery.of(context).size.width;
    if (width > 900) {
      return 4;
    } else if (width > 600) {
      return 3;
    } else {
      return 2;
    }
  }

  int calculateDurationInMonths(DateTime? startDate, DateTime? endDate) {
    if (startDate == null || endDate == null) {
      return 0;
    }

    int yearsDifference = endDate.year - startDate.year;
    int monthsDifference = endDate.month - startDate.month;

    return yearsDifference * 12 + monthsDifference;
  }
}

class CustomLoadingWidget extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Image.asset(
            'assets/images/Infinity@1x-1.0s-200px-200px.gif',
            width: 100,
            height: 100,
          ),
          const SizedBox(height: 20),
          const Text(
            'Loading...',
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
        ],
      ),
    );
  }
}
