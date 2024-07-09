import 'package:ephraim_umunnakwe/pages/web/routes/app_routes.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/footer.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/gradient_container.dart';
import 'package:ephraim_umunnakwe/utils/util_methods.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class AboutMe extends StatelessWidget {
  AboutMe({super.key});

  final gestureRecogniser = TapGestureRecognizer();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: GradientContainer(
        child: Stack(
          children: [
            SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                child: Column(
                  mainAxisSize: MainAxisSize.max,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const SizedBox(height: 80),
                    Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Expanded(
                            flex: 3,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                SelectableText(
                                  'About Me',
                                  style: Theme.of(context)
                                      .textTheme
                                      .headlineLarge!
                                      .copyWith(
                                          color: Colors.white,
                                          fontWeight: FontWeight.bold),
                                ),
                                SelectableText.rich(
                                  textAlign: TextAlign.start,
                                  TextSpan(
                                      text: "Hi, I'm ",
                                      spellOut: true,
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium!
                                          .copyWith(color: Colors.white),
                                      children: [
                                        TextSpan(
                                          text: 'Ephraim Umunnakwe',
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium!
                                              .copyWith(
                                                  color: Colors.yellow,
                                                  fontWeight: FontWeight.bold,
                                                  fontFamily: 'Avenir'),
                                        ),
                                        const TextSpan(
                                            text:
                                                ", but you can call me King Raym, which is a nickname I've embraced with pride. I hail from  "),
                                        TextSpan(
                                          text: 'Imo State, Nigeria. ',
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium!
                                              .copyWith(
                                                  color: Colors.yellow,
                                                  fontWeight: FontWeight.bold,
                                                  fontFamily: 'Avenir'),
                                        ),
                                        const TextSpan(
                                            text:
                                                "\n\nMy friends often call me Leo, a name that reflects both my strength and leadership qualities."
                                                "I'm passionate about technology and software development, particularly in the realm of mobile applications."
                                                " My expertise lies in Flutter, where I leverage Provider for state management to build efficient, scalable, and high-performing apps."
                                                " My journey in the tech world has been fueled by a relentless curiosity and a desire to innovate and solve real-world problems through code."
                                                "Beyond my professional life, I find joy in continuous learning and self-improvement. Whether it's exploring new programming paradigms,"
                                                " keeping up with the latest industry trends, or diving into a good book, I'm always on the lookout for opportunities to expand my knowledge and skills."
                                                "In my free time, I enjoy connecting with friends and family, cherishing the moments we share and the bonds we strengthen. "
                                                "These relationships are a cornerstone of my life, providing support and inspiration in everything I do."
                                                " I aim to leave a positive impact on the world, one line of code at a time."
                                                " My journey is a testament to perseverance, creativity, and the belief that with dedication and passion, we can achieve great things."),
                                        const TextSpan(
                                            text:
                                                '\n\nIn 2023, I founded a Startup '),
                                        TextSpan(
                                          text: '"Raym Universe Limited". ',
                                          recognizer: gestureRecogniser
                                            ..onTap = () async {
                                              await openLink(
                                                  'https://theraymuniverse.com');
                                            },
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium!
                                              .copyWith(
                                                  color: Colors.orange,
                                                  fontWeight: FontWeight.bold,
                                                  fontFamily: 'Avenir'),
                                        ),
                                        const TextSpan(
                                            text:
                                                "A dynamic and innovative company dedicated to transforming ideas"
                                                " into reality through cutting-edge technology and creative solutions. "
                                                "Although with my focus on Robotics we at the meantime specialize in software development. "
                                                "The company so far, excels in building high-quality mobile and web applications tailored to meet the unique needs of its clients."
                                                " Beyond software, the company is also at the forefront of robotic innovations and research, exploring new frontiers in automation and"
                                                " intelligent systems. With a focus on user experience, functionality, and technological advancement, Raym Universe Limited leverages the"
                                                " latest tools and methodologies to deliver exceptional products that drive business growth and efficiency. Explore more about our services "
                                                "and projects at"),
                                        TextSpan(
                                          text: "it's official website. ",
                                          recognizer: gestureRecogniser
                                            ..onTap = () async {
                                              await openLink(
                                                  'https://theraymuniverse.com');
                                            },
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyMedium!
                                              .copyWith(
                                                  color: Colors.yellow,
                                                  fontWeight: FontWeight.bold,
                                                  fontFamily: 'Avenir'),
                                        ),
                                      ]),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                              flex: 2,
                              child: Column(
                                children: [
                                  ClipRRect(
                                      borderRadius: BorderRadius.circular(50),
                                      child: Image.asset(
                                          fit: BoxFit.cover,
                                          'assets/images/profile_img.jpg')),
                                  const SizedBox(height: 20),
                                  SelectableText("Core Technologies/Stack",
                                      style: Theme.of(context)
                                          .textTheme
                                          .bodyMedium!
                                          .copyWith(
                                              fontWeight: FontWeight.bold,
                                              color: Colors.white,
                                              fontFamily: 'Avenir')),
                                  const SizedBox(height: 20),
                                  const Wrap(
                                      alignment: WrapAlignment.center,
                                      children: [
                                        FaIcon(FontAwesomeIcons.android,
                                            color: Colors.green),
                                        SizedBox(width: 10),
                                        FaIcon(FontAwesomeIcons.apple,
                                            color: Colors.grey),
                                        SizedBox(width: 10),
                                        FaIcon(FontAwesomeIcons.nodeJs,
                                            color: Colors.yellow),
                                        SizedBox(width: 10),
                                        FaIcon(FontAwesomeIcons.java,
                                            color: Colors.red),
                                        SizedBox(width: 10),
                                        FaIcon(FontAwesomeIcons.c,
                                            color: Colors.white),
                                      ])
                                ],
                              ))
                        ]),
                    const SizedBox(height: 80),
                    const Divider(),
                    const SizedBox(height: 80),
                    const Footer(isDesktop: true),
                  ],
                ),
              ),
            ),
            CustomBackButton(clickAction: () {
              Navigator.pushNamed(context, AppRoutes.homePage);
            })
          ],
        ),
      ),
    );
  }
}

class CustomBackButton extends StatelessWidget {
  final Function() clickAction;
  const CustomBackButton({
    super.key,
    required this.clickAction,
  });

  @override
  Widget build(BuildContext context) {
    return Align(
      alignment: Alignment.topLeft,
      child: Padding(
        padding: const EdgeInsets.all(8.0),
        child: InkWell(
          onTap: clickAction,
          child: Container(
            height: 30,
            width: 100,
            decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.3),
                borderRadius: BorderRadius.circular(50)),
            child: const Center(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  FaIcon(
                    FontAwesomeIcons.arrowLeft,
                    color: Colors.white,
                  ),
                  SizedBox(width: 10),
                  SelectableText(
                    "back",
                    style: TextStyle(color: Colors.white),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
