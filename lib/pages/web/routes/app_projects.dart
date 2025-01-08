import 'package:ephraim_umunnakwe/pages/web/widgets/custom_icon_widget.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/customloading_widget.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/gradient_container.dart';
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
    WidgetsBinding.instance.addPostFrameCallback((_) {
      getAllProjectList();
    });
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
                  ? const Center(child: CustomLoadingWidget())
                  : Expanded(
                      child: Center(
                        child: Container(
                          constraints: const BoxConstraints(maxWidth: 800),
                          child: ListView.builder(
                            itemCount: context
                                .watch<ProjectsProvider>()
                                .projects
                                .length,
                            padding: const EdgeInsets.all(22),
                            physics: const BouncingScrollPhysics(),
                            itemBuilder: (context, index) {
                              var project = Provider.of<ProjectsProvider>(
                                      context,
                                      listen: false)
                                  .projects[index];
                              return Card(
                                elevation: 0,
                                margin:
                                    const EdgeInsets.symmetric(vertical: 10),
                                child: Padding(
                                  padding: const EdgeInsets.all(8.0),
                                  child: Column(
                                    children: [
                                      Padding(
                                        padding: EdgeInsets.all(8.sp),
                                        child: Stack(
                                          children: [
                                            Column(
                                              children: [
                                                SizedBox(
                                                  width:
                                                      MediaQuery.sizeOf(context)
                                                          .width,
                                                  child: ClipRRect(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                            10),
                                                    child: Image.asset(
                                                      "assets/images/profile_img.jpg",
                                                      fit: BoxFit.cover,
                                                    ),
                                                  ),
                                                ),
                                                const SizedBox(height: 20),
                                                Align(
                                                  alignment:
                                                      Alignment.centerLeft,
                                                  child: SelectableText(
                                                    project.name ?? "N/A",
                                                    textAlign: TextAlign.start,
                                                    style: Theme.of(context)
                                                        .textTheme
                                                        .bodyLarge!
                                                        .copyWith(
                                                            fontWeight:
                                                                FontWeight.bold,
                                                            fontFamily:
                                                                'Avenir'),
                                                  ),
                                                ),
                                              ],
                                            ),
                                            const Align(
                                              alignment: Alignment.topRight,
                                              child: Padding(
                                                padding: EdgeInsets.all(8.0),
                                                child: SizedBox(
                                                  width: 100,
                                                  child: Column(
                                                    mainAxisSize:
                                                        MainAxisSize.min,
                                                    children: [
                                                      CustomIconWidget(
                                                        icon: FontAwesomeIcons
                                                            .googlePlay,
                                                        color: Colors.green,
                                                        radius: 100,
                                                      ),
                                                      SizedBox(height: 10),
                                                      CustomIconWidget(
                                                        icon: FontAwesomeIcons
                                                            .appStore,
                                                        color: Colors.grey,
                                                        radius: 100,
                                                      ),
                                                      SizedBox(height: 10),
                                                      CustomIconWidget(
                                                        icon: FontAwesomeIcons
                                                            .globe,
                                                        color: Colors.blue,
                                                        radius: 100,
                                                      ),
                                                      SizedBox(height: 10),
                                                      CustomIconWidget(
                                                        icon: FontAwesomeIcons
                                                            .code,
                                                        color: Colors.black,
                                                        radius: 100,
                                                      ),
                                                    ],
                                                  ),
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
                                          )),
                                      const SizedBox(height: 15),
                                      Column(
                                        crossAxisAlignment:
                                            CrossAxisAlignment.start,
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
                                                                    ? Colors
                                                                        .green
                                                                    : Colors
                                                                        .black,
                                                        fontWeight:
                                                            FontWeight.w900),
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
                                                backgroundColor:
                                                    Colors.blueAccent,
                                                side: BorderSide.none,
                                                labelStyle: const TextStyle(
                                                    color: Colors.white),
                                              );
                                            }).toList(),
                                          ),
                                          const SizedBox(height: 10),
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
                                                        fontWeight:
                                                            FontWeight.w900),
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
                          ),
                        ),
                      ),
                    )
            ],
          ),
        )),
      ),
    );
  }

  Future<void> getAllProjectList() async {
    await Provider.of<ProjectsProvider>(context, listen: false).fetchProjects();
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
