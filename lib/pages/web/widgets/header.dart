import 'package:ephraim_umunnakwe/pages/web/widgets/custom_icon_widget.dart';
import 'package:ephraim_umunnakwe/pages/web/widgets/gradient_container.dart';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class Header extends StatelessWidget {
  const Header({super.key});

  static final reviewMessageCtrl = TextEditingController();
  static final reviewerNameCtrl = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        // gradient: LinearGradient(
        //   colors: [Colors.blue, Colors.purple],
        // ),
        color: Colors.transparent,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        mainAxisSize: MainAxisSize.max,
        children: [
          const CircleAvatar(
              radius: 40,
              backgroundImage: AssetImage('assets/images/profile_img.jpg')),
          const Spacer(),
          const Text(
            'Ephraim Umunnakwe (King Raym)',
            style: TextStyle(
              fontSize: 32,
              color: Colors.white,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 20),
          const Text(
            'Professional Software Engineer',
            style: TextStyle(
              fontSize: 20,
              color: Colors.white70,
            ),
          ),
          const SizedBox(width: 10),
          CustomIconWidget(
              onClick: () {
                showDialog(
                    context: context,
                    builder: (context) {
                      return GradientContainer(
                        child: Dialog(
                          backgroundColor: Colors.white.withOpacity(0.2),
                          child: SizedBox(
                            width: 600,
                            child: Padding(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 20, vertical: 16),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    "Write me a review",
                                    style: Theme.of(context)
                                        .textTheme
                                        .titleMedium!
                                        .copyWith(color: Colors.white),
                                  ),
                                  const SizedBox(height: 20),
                                  TextField(
                                    decoration: InputDecoration(
                                        label: Text(
                                          "Your name",
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyLarge!
                                              .copyWith(color: Colors.white),
                                        ),
                                        border: OutlineInputBorder(
                                            borderSide: BorderSide(
                                                color: Colors.white))),
                                    keyboardType: TextInputType.name,
                                    maxLines: 1,
                                    controller: reviewerNameCtrl,
                                    style: Theme.of(context)
                                        .textTheme
                                        .bodyLarge!
                                        .copyWith(color: Colors.white),
                                  ),
                                  const SizedBox(height: 10),
                                  TextField(
                                    cursorColor: Colors.white,
                                    decoration: InputDecoration(
                                        label: Text(
                                          "Your review",
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyLarge!
                                              .copyWith(color: Colors.white),
                                        ),
                                        border: OutlineInputBorder(
                                            borderSide: BorderSide(
                                                color: Colors.white))),
                                    keyboardType: TextInputType.multiline,
                                    maxLength: 500,
                                    controller: reviewMessageCtrl,
                                    style: Theme.of(context)
                                        .textTheme
                                        .bodyLarge!
                                        .copyWith(color: Colors.white),
                                  ),
                                  const SizedBox(height: 40),
                                  SizedBox(
                                    height: 55,
                                    width: double.infinity,
                                    child: MaterialButton(
                                        elevation: 0,
                                        onPressed: () {},
                                        color: Colors.white,
                                        child: Text(
                                          "Submit",
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyLarge!
                                              .copyWith(
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.green,
                                                  fontFamily: 'Avenir'),
                                        )),
                                  ),
                                  const SizedBox(height: 10),
                                  SizedBox(
                                    height: 55,
                                    width: double.infinity,
                                    child: MaterialButton(
                                        elevation: 0,
                                        onPressed: () {
                                          Navigator.pop(context);
                                        },
                                        color: Colors.red,
                                        child: Text(
                                          "Cancel",
                                          style: Theme.of(context)
                                              .textTheme
                                              .bodyLarge!
                                              .copyWith(
                                                  fontWeight: FontWeight.bold,
                                                  color: Colors.white,
                                                  fontFamily: 'Avenir'),
                                        )),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      );
                    });
              },
              icon: FontAwesomeIcons.star,
              color: Colors.white),
          const SizedBox(width: 10),
        ],
      ),
    );
  }
}
