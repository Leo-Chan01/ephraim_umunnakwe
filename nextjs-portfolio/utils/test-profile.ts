// Test file to verify database operations work correctly
import { portfolioService } from '../lib/supabase';

export async function testProfileSave() {
  try {
    console.log('Testing profile save functionality...');
    
    const testData = {
      personalInfo: {
        name: 'Ephraim Umunnakwe',
        title: 'Software Engineer',
        email: 'ephraimumunnakwe3@gmail.com',
        phone: '+1 (555) 123-4567',
        location: 'Remote / Global',
        bio: 'Passionate software engineer specializing in mobile and web development.'
      },
      socialLinks: [
        {
          platform: 'LinkedIn',
          url: 'https://linkedin.com/in/ephraim-umunnakwe',
          is_visible: true
        },
        {
          platform: 'GitHub',
          url: 'https://github.com/ephraim-umunnakwe',
          is_visible: true
        },
        {
          platform: 'Twitter',
          url: 'https://twitter.com/ephraim_u',
          is_visible: true
        }
      ]
    };

    const result = await portfolioService.saveProfile(testData);
    console.log('✅ Profile saved successfully:', result);
    return result;
    
  } catch (error) {
    console.error('❌ Profile save failed:', error);
    throw error;
  }
}

export async function testIndividualOperations() {
  try {
    console.log('Testing individual social link operations...');
    
    // Test creating a single social link
    await portfolioService.createSocialLink({
      platform: 'Instagram',
      url: 'https://instagram.com/ephraim_u',
      is_visible: false
    });
    console.log('✅ Created Instagram link');

    // Test updating a social link
    await portfolioService.updateSocialLink('Instagram', {
      url: 'https://instagram.com/ephraim_umunnakwe',
      is_visible: true
    });
    console.log('✅ Updated Instagram link');

    // Test deleting a social link
    await portfolioService.deleteSocialLink('Instagram');
    console.log('✅ Deleted Instagram link');

    console.log('✅ All individual operations completed successfully');
    
  } catch (error) {
    console.error('❌ Individual operations failed:', error);
    throw error;
  }
}

// Usage example:
// import { testProfileSave, testIndividualOperations } from './test-profile';
// testProfileSave().then(() => console.log('Test completed'));
