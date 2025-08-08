# Portfolio Admin Dashboard

A comprehensive admin dashboard for managing your portfolio website content. Built with Flutter and Supabase for real-time content management.

## Features

- **Project Management**: Add, edit, and delete projects with technologies, dates, and priorities
- **Testimonials**: Manage client testimonials with ratings and timestamps
- **Social Links**: Configure social media and contact links with visibility controls
- **Personal Information**: Update your bio, contact details, and professional title
- **Real-time Updates**: Changes instantly reflect on your portfolio website
- **Dark/Light Theme**: Toggle between themes for comfortable editing
- **Statistics Dashboard**: Overview of your portfolio content with key metrics
- **Export Functionality**: Export your data to JSON files for backup

## Setup Instructions

1. **Install Dependencies**
   ```bash
   flutter pub get
   ```

2. **Configure Supabase**
   - Follow the instructions in `../SUPABASE_SETUP.md` to set up your database
   - Update `lib/services/supabase_config.dart` with your Supabase credentials:
     ```dart
     static const String supabaseUrl = 'YOUR_SUPABASE_URL';
     static const String supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';
     ```

3. **Run the Dashboard**
   ```bash
   flutter run -d chrome --web-port=8081
   ```

## Project Structure

```
lib/
├── main.dart                 # Application entry point
├── models/
│   └── portfolio_data.dart   # Data models for all content types
├── providers/
│   └── admin_provider.dart   # State management with Supabase integration
├── screens/
│   ├── dashboard_screen.dart     # Main dashboard with statistics
│   ├── projects_screen.dart      # Project management
│   ├── testimonials_screen.dart  # Testimonial management
│   ├── social_links_screen.dart  # Social links management
│   └── personal_info_screen.dart # Personal information editing
├── services/
│   ├── supabase_config.dart  # Supabase configuration
│   └── supabase_service.dart # Database operations
├── theme/
│   └── admin_theme.dart      # Light/dark theme definitions
└── widgets/
    ├── dashboard_card.dart   # Dashboard navigation cards
    └── stat_card.dart        # Statistics display cards
```

## Data Models

### Project
- Name, description, status, priority
- Start/end dates
- Technologies used
- Your role in the project

### Testimonial
- Author name and role
- Testimonial message
- Star rating (1-5)
- Creation timestamp

### Social Link
- Platform (GitHub, LinkedIn, etc.)
- URL
- Visibility toggle

### Personal Info
- Full name and professional title
- Contact information (email, phone, location)
- Bio/about section

## Usage

### Dashboard Overview
- View key statistics about your portfolio
- Quick access to all management sections
- Recent activity timeline

### Managing Projects
1. Click "Manage Projects" from the dashboard
2. Use the "+" button to add new projects
3. Click the menu button on any project to edit or delete
4. Fill in project details including technologies, dates, and priority

### Managing Testimonials
1. Navigate to "Testimonials" section
2. Add new testimonials with author details
3. Set star ratings using the interactive rating component
4. Edit or delete existing testimonials

### Social Links
1. Go to "Social Links" management
2. Add links for various platforms (GitHub, LinkedIn, etc.)
3. Toggle visibility for each link
4. Preview how links will appear on your portfolio

### Personal Information
1. Access "Personal Info" section
2. Update your name, title, and bio
3. Add contact information
4. Preview how your info will display

## Real-time Synchronization

The dashboard uses Supabase real-time features to:
- Instantly sync changes to your portfolio website
- Allow multiple admin users to collaborate
- Provide live updates without page refreshes

## Customization

### Themes
- Toggle between light and dark modes
- Customize colors in `theme/admin_theme.dart`

### Adding New Fields
1. Update data models in `models/portfolio_data.dart`
2. Add corresponding UI components in screen files
3. Update Supabase service methods
4. Modify database schema if needed

## Deployment

### Web Deployment
```bash
flutter build web --web-renderer html
```

Deploy the `build/web` folder to your preferred hosting service.

### Desktop Deployment
```bash
flutter build windows  # or macos/linux
```

## Troubleshooting

### Common Issues

1. **Supabase Connection Errors**
   - Verify URL and anon key in `supabase_config.dart`
   - Check if RLS policies are properly set up
   - Ensure tables exist in your Supabase project

2. **Data Not Syncing**
   - Check internet connection
   - Verify Supabase project is active
   - Look for error messages in browser console

3. **Build Errors**
   - Run `flutter clean && flutter pub get`
   - Ensure all dependencies are compatible
   - Check for syntax errors in configuration files

## Support

For issues or questions:
1. Check the `SUPABASE_SETUP.md` file
2. Review error logs in browser developer tools
3. Verify all configuration files are properly set up

## License

This admin dashboard is part of the Ephraim Umunnakwe portfolio project.
