import React from 'react';
import Head from 'next/head';

/**
 * StructuredData component for adding JSON-LD structured data to pages
 * Improves SEO by providing search engines with structured information about the page
 */
const StructuredData = ({ type, data }) => {
  // Generate structured data based on type
  const generateStructuredData = () => {
    switch (type) {
      case 'Organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: data.name || 'Cooperative E-Wallet',
          url: data.url || 'https://cooperative-ewallet.com',
          logo: data.logo || 'https://cooperative-ewallet.com/logo.png',
          sameAs: data.sameAs || [
            'https://facebook.com/cooperativeewallet',
            'https://twitter.com/coopewallet',
            'https://linkedin.com/company/cooperative-ewallet',
          ],
          contactPoint: data.contactPoint || {
            '@type': 'ContactPoint',
            telephone: '+639123456789',
            contactType: 'customer service',
            areaServed: 'PH',
            availableLanguage: ['English', 'Filipino'],
          },
        };
      
      case 'Product':
        return {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: data.name || 'Cooperative E-Wallet System',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web, iOS, Android',
          offers: {
            '@type': 'Offer',
            price: data.price || '0',
            priceCurrency: data.priceCurrency || 'PHP',
          },
          aggregateRating: data.aggregateRating || {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1250',
          },
          description: data.description || 'A comprehensive financial management solution for credit cooperatives.',
        };
      
      case 'FAQPage':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: data.questions?.map(q => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: q.answer,
            },
          })) || [],
        };
      
      case 'BreadcrumbList':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.items?.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })) || [],
        };
      
      case 'WebSite':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: data.name || 'Cooperative E-Wallet',
          url: data.url || 'https://cooperative-ewallet.com',
          potentialAction: {
            '@type': 'SearchAction',
            target: `${data.url || 'https://cooperative-ewallet.com'}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        };
      
      case 'LocalBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: data.name || 'Cooperative E-Wallet',
          image: data.image || 'https://cooperative-ewallet.com/office.jpg',
          '@id': data.url || 'https://cooperative-ewallet.com',
          url: data.url || 'https://cooperative-ewallet.com',
          telephone: data.telephone || '+639123456789',
          address: data.address || {
            '@type': 'PostalAddress',
            streetAddress: '123 Main Street',
            addressLocality: 'Manila',
            addressRegion: 'Metro Manila',
            postalCode: '1000',
            addressCountry: 'PH',
          },
          geo: data.geo || {
            '@type': 'GeoCoordinates',
            latitude: 14.5995,
            longitude: 120.9842,
          },
          openingHoursSpecification: data.openingHours || [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
              opens: '09:00',
              closes: '17:00',
            },
          ],
        };
      
      default:
        return data;
    }
  };

  const structuredData = generateStructuredData();

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </Head>
  );
};

export default StructuredData;
