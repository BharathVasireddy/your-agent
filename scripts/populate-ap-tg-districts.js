const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const districts = {
  'AP': { // Andhra Pradesh - All 26 districts
    stateName: 'Andhra Pradesh',
    districts: [
      'Alluri Sitharama Raju',
      'Anakapalli',
      'Anantapur',
      'Annamayya',
      'Bapatla',
      'Chittoor',
      'East Godavari',
      'Eluru',
      'Guntur',
      'Kakinada',
      'Konaseema',
      'Krishna',
      'Kurnool',
      'Nandyal',
      'NTR',
      'Palnadu',
      'Parvathipuram Manyam',
      'Prakasam',
      'Sri Sathya Sai',
      'Srikakulam',
      'Tirupati',
      'Visakhapatnam',
      'Vizianagaram',
      'West Godavari',
      'YSR Kadapa'
    ]
  },
  'TG': { // Telangana
    stateName: 'Telangana',
    districts: [
      'Adilabad',
      'Bhadradri Kothagudem',
      'Hyderabad',
      'Jagtial',
      'Jangaon',
      'Jayashankar Bhupalpally',
      'Jogulamba Gadwal',
      'Kamareddy',
      'Karimnagar',
      'Khammam',
      'Komaram Bheem Asifabad',
      'Mahabubabad',
      'Mahabubnagar',
      'Mancherial',
      'Medak',
      'Medchal-Malkajgiri',
      'Mulugu',
      'Nagarkurnool',
      'Nalgonda',
      'Narayanpet',
      'Nirmal',
      'Nizamabad',
      'Peddapalli',
      'Rajanna Sircilla',
      'Rangareddy',
      'Sangareddy',
      'Siddipet',
      'Suryapet',
      'Vikarabad',
      'Wanaparthy',
      'Warangal Rural',
      'Warangal Urban',
      'Yadadri Bhuvanagiri'
    ]
  }
};

async function populateDistricts() {
  console.log('Starting to populate districts for Andhra Pradesh and Telangana...');

  try {
    for (const [stateCode, stateData] of Object.entries(districts)) {
      // Find the state by code
      const state = await prisma.state.findUnique({
        where: { code: stateCode }
      });

      if (!state) {
        console.log(`❌ State ${stateData.stateName} (${stateCode}) not found`);
        continue;
      }

      console.log(`\n📍 Processing ${stateData.stateName} (${stateCode}):`);

      for (const districtName of stateData.districts) {
        try {
          await prisma.district.upsert({
            where: {
              name_stateId: {
                name: districtName,
                stateId: state.id
              }
            },
            update: {
              name: districtName,
              isActive: true,
            },
            create: {
              name: districtName,
              stateId: state.id,
              isActive: true,
            },
          });
          console.log(`  ✓ ${districtName}`);
        } catch (error) {
          console.log(`  ❌ Failed to create ${districtName}: ${error.message}`);
        }
      }
    }

    console.log('\n🎉 Successfully populated districts!');
    console.log('Summary:');
    console.log(`- Andhra Pradesh: ${districts.AP.districts.length} districts`);
    console.log(`- Telangana: ${districts.TG.districts.length} districts`);
  } catch (error) {
    console.error('Error populating districts:', error);
  } finally {
    await prisma.$disconnect();
  }
}

populateDistricts();
