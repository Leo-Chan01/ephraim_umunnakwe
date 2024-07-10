import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class JourneyEvent extends StatelessWidget {
  final String year;
  final String title;
  final String description;

  const JourneyEvent({
    super.key,
    required this.year,
    required this.title,
    required this.description,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Column(
            children: [
              Container(
                width: 20.w,
                height: 20.w,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Colors.orange,
                ),
              ),
              Container(
                width: 2.w,
                height: 100,
                color: Colors.orange,
              ),
            ],
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Card(
              elevation: 0,
              color: Colors.white.withOpacity(0.2),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SelectableText(
                      year,
                      style: TextStyle(
                          fontSize: 36.sp,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          fontFamily: 'Avenir'),
                    ),
                    const SizedBox(height: 8),
                    SelectableText(
                      title,
                      style: TextStyle(
                          fontSize: 34.sp,
                          fontWeight: FontWeight.w600,
                          color: Colors.yellow),
                    ),
                    const SizedBox(height: 8),
                    SelectableText(
                      description,
                      style: TextStyle(fontSize: 32.sp, color: Colors.white),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
