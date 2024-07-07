import 'package:ephraim_umunnakwe/pages/web/widgets/custom_icon_widget.dart';
import 'package:flutter/material.dart';

class Header extends StatelessWidget {
  const Header({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Colors.blue, Colors.purple],
        ),
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
              onClick: () {},
              icon: Icons.dark_mode_rounded,
              color: Colors.white),
          const SizedBox(width: 10),
        ],
      ),
    );
  }
}
