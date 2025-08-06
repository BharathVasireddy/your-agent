# 🏡 Property Type Categorization System

## Overview

This directory contains the complete property categorization system that allows agents to create different types of properties with type-specific forms.

## Property Types

### For Sale:
- **Agricultural Land** - Fields and farming land
- **Plot** - Residential/commercial plots
- **Flat/Apartment** - Multi-story residential units
- **Villa/Independent House** - Standalone residential properties
- **IT Commercial Space** - Office spaces for IT companies
- **Farm House** - Recreational/weekend properties

### For Rent:
- **Flat/Apartment** - Multi-story residential units
- **Villa/Independent House** - Standalone residential properties
- **IT Commercial Space** - Office spaces for IT companies

## File Structure

```
src/components/property/
├── PropertyTypeSelector.tsx       # Step 1: Type selection UI
├── PropertyCreationWizard.tsx     # Main workflow coordinator
└── forms/
    ├── BasePropertyForm.tsx       # Common fields for all properties
    ├── PropertyFormFactory.tsx    # Dynamic form renderer
    ├── AgriculturalLandForm.tsx   # Agricultural Land specific fields
    ├── PlotForm.tsx              # Plot specific fields
    ├── FlatApartmentForm.tsx     # Flat/Apartment specific fields
    ├── VillaIndependentHouseForm.tsx # Villa/House specific fields
    ├── ITCommercialSpaceForm.tsx # Commercial space specific fields
    └── FarmHouseForm.tsx         # Farm House specific fields
```

## How It Works

1. **Type Selection**: Agent selects listing type (Sale/Rent) and property type
2. **Form Rendering**: System shows appropriate form based on selection
3. **Data Collection**: Type-specific fields collect relevant information
4. **Submission**: Property data is processed and saved

## Current Status

✅ **Completed:**
- Property type constants and enums
- Type selection UI with categories
- Base form structure
- Form factory for dynamic rendering
- All placeholder forms created
- Integrated into new property creation flow

⏳ **Pending:**
- Property type specific field definitions (waiting for specifications)
- Database schema updates for new property types
- API integration for property creation

## Usage

The system is now integrated into `/agent/dashboard/properties/new`. Agents will:

1. Select between "For Sale" or "For Rent"
2. Choose the appropriate property type from categorized options
3. Fill out the type-specific form
4. Submit to create the property

## Next Steps

Ready for you to provide the specific fields for each property type so we can implement the detailed forms! 🚀