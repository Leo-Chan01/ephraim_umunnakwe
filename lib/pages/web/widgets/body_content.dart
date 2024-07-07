import 'package:flutter/material.dart';
import 'feature_card.dart';

class BodyContent extends StatelessWidget {
  const BodyContent({super.key});

  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'My assurance',
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 20),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              FeatureCard(
                icon: Icons.security,
                title: 'Security',
                description: 'Top-notch security for your Software',
              ),
              FeatureCard(
                icon: Icons.speed,
                title: 'Speed',
                description: 'Fast and reliable Software performance',
              ),
              FeatureCard(
                icon: Icons.support,
                title: 'Support',
                description: '24/7 customer support',
              ),
            ],
          ),
        ],
      ),
    );
  }
}
