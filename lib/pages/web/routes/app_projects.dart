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
                      gridDelegate: SliverGridDelegateWithMaxCrossAxisExtent(
                          maxCrossAxisExtent:
                              getCurrentViewWidth(context) * (70 / 100)),
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
                          child: Column(
                            children: [
                              Expanded(
                                flex: 10,
                                child: Padding(
                                  padding: EdgeInsets.all(8.sp),
                                  child: Row(
                                    children: [
                                      Expanded(
                                        flex: 5,
                                        child: ClipRRect(
                                            borderRadius:
                                                BorderRadius.circular(10),
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
                                              CustomIconWidget(
                                                icon:
                                                    FontAwesomeIcons.googlePlay,
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
                              ),
                              const SizedBox(height: 20),
                              SelectableText(
                                project.name ?? "N/A",
                                style: Theme.of(context)
                                    .textTheme
                                    .bodyLarge!
                                    .copyWith(
                                        fontWeight: FontWeight.bold,
                                        fontFamily: 'Avenir'),
                              ),
                              const SizedBox(height: 15),
                              Expanded(
                                  flex: 8,
                                  child: Padding(
                                    padding: const EdgeInsets.all(8.0),
                                    child: Container(
                                        width: double.infinity,
                                        decoration: BoxDecoration(
                                            border: Border.all(
                                                color: Colors.grey, width: 2),
                                            borderRadius:
                                                BorderRadius.circular(10)),
                                        child: Padding(
                                          padding: const EdgeInsets.all(8.0),
                                          child: ExpandingTextWidget(
                                              truncationLength: 50,
                                              text:
                                                  project.description ?? 'N/A',
                                              widgetStyle: Theme.of(context)
                                                  .textTheme
                                                  .bodySmall!
                                                  .copyWith(
                                                      color: Colors.black,
                                                      fontFamily: 'Avenir')),
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

  Future<void> getAllProjectList() async {
    await Provider.of<ProjectsProvider>(context, listen: false).fetchProjects();
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
