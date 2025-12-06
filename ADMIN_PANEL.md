# Admin Panel Documentation

## Overview
The Admin Panel provides a comprehensive interface for managing your phone price comparison platform. You can add, edit, and delete phones, shops, and prices through an intuitive dashboard.

## Features

### 📱 Phone Management
- **Add New Phones**: Create phone entries with brand, model, category, image URL, and release year
- **Edit Phone Details**: Update existing phone information
- **Delete Phones**: Remove outdated phones from the database
- **Search Phones**: Find phones by brand or model name
- **Categories**: Budget, Midrange, Flagship, Gaming, Foldable

### 🏪 Shop Management
- **Add New Shops**: Register shops with name, location, contact details
- **Edit Shop Info**: Update shop information
- **Delete Shops**: Remove shops from the system
- **Search Shops**: Find shops by name or city
- **Verification**: Mark shops as verified or featured
- **Shop Details**: Name, city, address, contact number, website

### 💰 Price Management
- **Add Prices**: Link phones to shops with pricing information
- **Edit Prices**: Update existing price entries
- **Delete Prices**: Remove outdated price listings
- **Price Status**: Mark prices as active or inactive
- **Currency Support**: Multi-currency pricing (default: LKR)

## Accessing the Admin Panel

### Option 1: From Homepage
Click the **"Admin Panel"** button in the hero section

### Option 2: From Navbar
Click the **"Admin Panel"** button in the top navigation bar

### Option 3: Direct URL
Navigate to: `http://localhost:5174/admin`

## Using the Admin Panel

### Adding a New Item

1. Select the appropriate tab (Phones, Shops, or Prices)
2. Click the **"Add New"** button
3. Fill in the form fields:
   - All fields marked as required must be completed
   - Use valid URLs for images and websites
   - Select appropriate categories from dropdowns
4. Click **"Create"** to save
5. The item will appear in the table immediately

### Editing an Item

1. Find the item in the table using search if needed
2. Click the **Edit** (blue pencil) icon
3. Modify the fields as needed
4. Click **"Update"** to save changes
5. Click **"Cancel"** to discard changes

### Deleting an Item

1. Find the item in the table
2. Click the **Delete** (red trash) icon
3. Confirm the deletion in the popup dialog
4. The item will be removed from the database

**⚠️ Warning**: Deleting phones or shops may fail if they are referenced by price entries. Delete related prices first.

### Searching

Use the search bar to filter items:
- **Phones**: Search by brand or model (e.g., "iPhone", "Galaxy")
- **Shops**: Search by name or city (e.g., "Singer", "Colombo")
- **Prices**: No search (view all entries)

## Form Fields Reference

### Phone Form
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Brand | Text | Yes | Phone manufacturer (e.g., Apple, Samsung) |
| Model | Text | Yes | Phone model name (e.g., iPhone 15 Pro) |
| Category | Dropdown | Yes | Budget, Midrange, Flagship, Gaming, Foldable |
| Image URL | URL | No | Direct link to phone image |
| Release Year | Number | No | Year the phone was released (2000-2026) |

### Shop Form
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Shop Name | Text | Yes | Name of the shop |
| City | Text | No | City where shop is located |
| Address | Textarea | No | Full street address |
| Contact Number | Tel | No | Phone number for contact |
| Website | URL | No | Shop's website URL |
| Verified Shop | Checkbox | No | Mark as verified seller |
| Featured Shop | Checkbox | No | Mark as featured partner |

### Price Form
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Phone | Dropdown | Yes | Select from existing phones |
| Shop | Dropdown | Yes | Select from existing shops |
| Price | Number | Yes | Price amount (positive decimal) |
| Currency | Text | Yes | 3-letter currency code (e.g., LKR, USD) |
| Active Price | Checkbox | No | Whether price is currently active |

## Tips & Best Practices

### For Phone Entries
- Use high-quality image URLs (recommended: 600x600px or larger)
- Use consistent brand naming (e.g., always "Apple" not "apple" or "APPLE")
- Set correct category for better AI recommendations
- Keep release year updated for accurate trending calculations

### For Shop Entries
- Verify shop information before marking as verified
- Use featured status sparingly for premium partners
- Include complete contact details for better user experience
- Update website URLs regularly

### For Price Entries
- Mark outdated prices as inactive instead of deleting
- Create multiple price entries for the same phone at different shops
- Use consistent currency codes (LKR for Sri Lankan Rupees)
- Update prices regularly to maintain accuracy

## Troubleshooting

### "Failed to save item"
- Check all required fields are filled
- Verify URL formats are correct (must start with http:// or https://)
- Ensure phone and shop exist before adding prices
- Check browser console for detailed error messages

### "Failed to delete item"
- The item may be referenced by other records
- For phones: Delete all related prices first
- For shops: Delete all related prices first
- Contact system administrator if issue persists

### Changes not appearing
- Refresh the page (F5 or Ctrl+R)
- Clear browser cache if needed
- Check backend server is running

### Validation errors
- Phone release year must be between 2000 and current year + 1
- Price must be a positive number
- Currency code must be exactly 3 characters
- URLs must be valid (include http:// or https://)

## Security Notes

⚠️ **Important**: This admin panel does not have authentication in the current version. It is recommended to:
- Use it only in development environments
- Add authentication before production deployment
- Restrict access via firewall rules
- Implement role-based access control (RBAC)

## API Integration

The admin panel uses the following API endpoints:

### Phones
- `GET /api/phones` - List all phones
- `GET /api/phones/{id}` - Get phone by ID
- `POST /api/phones` - Create new phone
- `PUT /api/phones/{id}` - Update phone
- `DELETE /api/phones/{id}` - Delete phone

### Shops
- `GET /api/shops` - List all shops
- `GET /api/shops/{id}` - Get shop by ID
- `POST /api/shops` - Create new shop
- `PUT /api/shops/{id}` - Update shop
- `DELETE /api/shops/{id}` - Delete shop

### Prices
- `GET /api/prices` - List all prices
- `POST /api/prices` - Create new price
- `PUT /api/prices/{id}` - Update price
- `DELETE /api/prices/{id}` - Delete price

## Future Enhancements

Planned features for future versions:
- [ ] User authentication and authorization
- [ ] Bulk import/export (CSV, Excel)
- [ ] Price history tracking and charts
- [ ] Automated price updates via web scraping
- [ ] Image upload functionality
- [ ] Advanced filtering and sorting
- [ ] Audit logs for all changes
- [ ] Dashboard analytics and statistics

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the console for error messages
3. Verify backend server is running
4. Check database connection
5. Refer to the main README.md for setup instructions

---

**Version**: 1.0.0  
**Last Updated**: December 6, 2025
