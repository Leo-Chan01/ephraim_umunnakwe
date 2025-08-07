import 'package:flutter/material.dart';
import 'package:ephraim_umunnakwe/theme/colors.dart';

class GradientContainer extends StatefulWidget {
  final Widget child;
  final bool includeStars;
  final bool includeParticles;

  const GradientContainer({
    super.key,
    required this.child,
    this.includeStars = true,
    this.includeParticles = false,
  });

  @override
  _GradientContainerState createState() => _GradientContainerState();
}

class _GradientContainerState extends State<GradientContainer>
    with TickerProviderStateMixin {
  late AnimationController _primaryController;
  late AnimationController _secondaryController;
  late AnimationController _particleController;

  late Animation<Color?> _colorAnimation1;
  late Animation<Color?> _colorAnimation2;
  late Animation<Color?> _colorAnimation3;
  late Animation<double> _particleAnimation;

  @override
  void initState() {
    super.initState();

    // Primary gradient animation (slower, smoother)
    _primaryController = AnimationController(
      duration: const Duration(seconds: 8),
      vsync: this,
    );

    // Secondary gradient animation (medium speed)
    _secondaryController = AnimationController(
      duration: const Duration(seconds: 6),
      vsync: this,
    );

    // Particle animation (faster)
    _particleController = AnimationController(
      duration: const Duration(seconds: 20),
      vsync: this,
    );

    // Sophisticated color transitions
    _colorAnimation1 = TweenSequence<Color?>([
      TweenSequenceItem(
        tween: ColorTween(
          begin: AppColors.gradientStart,
          end: const Color(0xFF1E1B4B),
        ),
        weight: 25,
      ),
      TweenSequenceItem(
        tween: ColorTween(
          begin: const Color(0xFF1E1B4B),
          end: const Color(0xFF312E81),
        ),
        weight: 25,
      ),
      TweenSequenceItem(
        tween: ColorTween(
          begin: const Color(0xFF312E81),
          end: AppColors.gradientMiddle,
        ),
        weight: 25,
      ),
      TweenSequenceItem(
        tween: ColorTween(
          begin: AppColors.gradientMiddle,
          end: AppColors.gradientStart,
        ),
        weight: 25,
      ),
    ]).animate(CurvedAnimation(
      parent: _primaryController,
      curve: Curves.easeInOutSine,
    ));

    _colorAnimation2 = TweenSequence<Color?>([
      TweenSequenceItem(
        tween: ColorTween(
          begin: AppColors.gradientEnd,
          end: const Color(0xFF4C1D95),
        ),
        weight: 30,
      ),
      TweenSequenceItem(
        tween: ColorTween(
          begin: const Color(0xFF4C1D95),
          end: const Color(0xFF5B21B6),
        ),
        weight: 40,
      ),
      TweenSequenceItem(
        tween: ColorTween(
          begin: const Color(0xFF5B21B6),
          end: AppColors.gradientEnd,
        ),
        weight: 30,
      ),
    ]).animate(CurvedAnimation(
      parent: _secondaryController,
      curve: Curves.easeInOutCubic,
    ));

    _colorAnimation3 = ColorTween(
      begin: AppColors.gradientMiddle,
      end: const Color(0xFF1E3A8A),
    ).animate(CurvedAnimation(
      parent: _secondaryController,
      curve: Curves.easeInOutQuart,
    ));

    _particleAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(CurvedAnimation(
      parent: _particleController,
      curve: Curves.linear,
    ));

    // Start animations
    _primaryController.repeat();
    _secondaryController.repeat(reverse: true);
    if (widget.includeParticles) {
      _particleController.repeat();
    }
  }

  @override
  void dispose() {
    _primaryController.dispose();
    _secondaryController.dispose();
    _particleController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: Listenable.merge([
        _primaryController,
        _secondaryController,
        _particleController,
      ]),
      builder: (context, child) {
        return Container(
          decoration: BoxDecoration(
            gradient: RadialGradient(
              center: Alignment.topLeft,
              radius: 1.5,
              colors: [
                _colorAnimation1.value ?? AppColors.gradientStart,
                _colorAnimation3.value ?? AppColors.gradientMiddle,
                _colorAnimation2.value ?? AppColors.gradientEnd,
              ],
              stops: const [0.0, 0.6, 1.0],
            ),
          ),
          child: Stack(
            children: [
              // Animated overlay for depth
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topRight,
                    end: Alignment.bottomLeft,
                    colors: [
                      Colors.purple.withOpacity(0.1),
                      Colors.transparent,
                      Colors.blue.withOpacity(0.05),
                    ],
                  ),
                ),
              ),

              // Starfield background
              if (widget.includeStars) _buildStarfield(),

              // Particle system
              if (widget.includeParticles) _buildParticles(),

              // Main content
              widget.child,
            ],
          ),
        );
      },
    );
  }

  Widget _buildStarfield() {
    return Positioned.fill(
      child: CustomPaint(
        painter: StarfieldPainter(_particleAnimation.value),
      ),
    );
  }

  Widget _buildParticles() {
    return Positioned.fill(
      child: CustomPaint(
        painter: ParticlePainter(_particleAnimation.value),
      ),
    );
  }
}

class StarfieldPainter extends CustomPainter {
  final double animationValue;

  StarfieldPainter(this.animationValue);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.white.withOpacity(0.8)
      ..strokeCap = StrokeCap.round;

    // Generate stars at fixed positions
    final stars = _generateStars(size, 50);

    for (final star in stars) {
      final opacity =
          (0.3 + 0.7 * ((star.dx + star.dy + animationValue * 100) % 100) / 100)
              .clamp(0.0, 1.0);

      paint.color = Colors.white.withOpacity(opacity * 0.6);
      canvas.drawCircle(star, 1.0, paint);
    }
  }

  List<Offset> _generateStars(Size size, int count) {
    final stars = <Offset>[];
    for (int i = 0; i < count; i++) {
      final x = (i * 123.456) % size.width;
      final y = (i * 789.123) % size.height;
      stars.add(Offset(x, y));
    }
    return stars;
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}

class ParticlePainter extends CustomPainter {
  final double animationValue;

  ParticlePainter(this.animationValue);

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = AppColors.primaryCyan.withOpacity(0.3)
      ..strokeCap = StrokeCap.round;

    // Generate floating particles
    final particles = _generateParticles(size, 20);

    for (int i = 0; i < particles.length; i++) {
      final particle = particles[i];
      final progress = (animationValue + i * 0.1) % 1.0;
      final y = particle.dy + (size.height * 0.1 * progress);

      if (y < size.height + 10) {
        final opacity = (1.0 - progress) * 0.4;
        paint.color = AppColors.accentTeal.withOpacity(opacity);
        canvas.drawCircle(Offset(particle.dx, y), 2.0, paint);
      }
    }
  }

  List<Offset> _generateParticles(Size size, int count) {
    final particles = <Offset>[];
    for (int i = 0; i < count; i++) {
      final x = (i * 234.567) % size.width;
      final y = (i * 456.789) % (size.height * 0.3);
      particles.add(Offset(x, y));
    }
    return particles;
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => true;
}
