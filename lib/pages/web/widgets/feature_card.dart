import 'package:flutter/material.dart';

class FeatureCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String description;
  final bool isFocused;
  final bool? shouldExpand;

  const FeatureCard(
      {super.key,
      required this.icon,
      required this.title,
      required this.description,
      required this.isFocused,
      this.shouldExpand});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: (shouldExpand != null) ? double.infinity : null,
      child: Card(
        margin: (shouldExpand != null)
            ? EdgeInsets.symmetric(horizontal: 10, vertical: 4)
            : EdgeInsets.all(4),
        elevation: isFocused ? 2 : 0,
        shape: const RoundedRectangleBorder(borderRadius: BorderRadius.zero),
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            children: [
              Icon(icon, size: 50, color: Colors.blue),
              const SizedBox(height: 10),
              SelectableText(
                title,
                style: Theme.of(context)
                    .textTheme
                    .titleLarge!
                    .copyWith(color: Colors.black, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),
              SelectableText(
                description,
                textAlign: TextAlign.center,
                style: Theme.of(context)
                    .textTheme
                    .bodyMedium!
                    .copyWith(color: Colors.black, fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
