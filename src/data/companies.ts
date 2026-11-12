import { CategoryGroup, CompanyEntity, SyncLogEvent, PipelineMetric } from '../types/integration';

export const INTEGRATION_CATEGORIES: CategoryGroup[] = [
  {
    id: 'crm',
    title: 'CRM & MARKETING',
    color: '#0284c7', // Sky Blue
    description: 'Enterprise relationship management, lead attribution, customer lifecycle automation, and omnichannel campaign scoring.',
    iconName: 'Users',
    companies: [
      {
        id: 'hubspot',
        name: 'HubSpot',
        category: 'crm',
        categoryTitle: 'CRM & MARKETING',
        tagline: 'Inbound marketing, sales pipelines, and customer service suite',
        description: 'HubSpot delivers comprehensive inbound marketing, sales pipeline automation, and customer support. Clofast synchronizes contacts, companies, deals, lifecycle stages, and marketing engagement data bi-directionally with sub-second latency.',
        protocols: ['REST API v3', 'Webhooks', 'OAuth 2.0'],
        syncFrequency: 'Real-time Webhook / 30s Polling',
        authType: 'OAuth 2.0 with Granular Scopes',
        supportedObjects: ['Contacts', 'Companies', 'Deals', 'Tickets', 'Engagements', 'Line Items'],
        color: '#ff7a59',
        accentColor: '#ffe8e2',
        badgeBg: '#fff1ee',
        status: 'active',
        pingMs: 14,
        eventsPerMin: 4210,
        samplePayload: {
          event: 'deal.propertyChange',
          dealId: '9841295',
          dealName: 'Global Cloud Enterprise Tier 3',
          amount: 145000,
          stage: 'contract_sent',
          pipeline: 'default',
          ownerEmail: 'vp.sales@clofast-enterprise.com',
          hs_is_closed_won: false,
          syncedToErp: true
        }
      },
      {
        id: 'salesforce',
        name: 'Salesforce',
        category: 'crm',
        categoryTitle: 'CRM & MARKETING',
        tagline: 'Global enterprise customer relationship and revenue operations leader',
        description: 'Salesforce powers global enterprise sales pipelines, opportunity management, custom objects, and CPQ quotes. Clofast streams Salesforce Pub/Sub events and Change Data Capture (CDC) directly to ERP, payments, and data warehouses.',
        protocols: ['REST API', 'Bulk API 2.0', 'Pub/Sub gRPC', 'OAuth 2.0'],
        syncFrequency: 'Real-time CDC Streaming',
        authType: 'Connected App / JWT Bearer',
        supportedObjects: ['Leads', 'Accounts', 'Contacts', 'Opportunities', 'Contracts', 'Quotes'],
        color: '#00a1e0',
        accentColor: '#e0f4fc',
        badgeBg: '#ebf8fe',
        status: 'active',
        pingMs: 18,
        eventsPerMin: 8940,
        samplePayload: {
          schema: 'OpportunityChangeEvent',
          recordIds: ['0068c00000abc12AAA'],
          AccountId: '0018c00000xyz89BBB',
          StageName: 'Closed Won',
          Amount: 480000.0,
          Probability: 100,
          CloseDate: '2026-11-12',
          SyncedERP_Status: 'Provisioned_NetSuite'
        }
      },
      {
        id: 'adobe-marketing',
        name: 'Adobe Marketing',
        category: 'crm',
        categoryTitle: 'CRM & MARKETING',
        tagline: 'Experience Cloud, Marketo lead scoring, and customer journey orchestration',
        description: 'Adobe Marketing Cloud & Experience Platform orchestrates customer journey maps, predictive lead scoring, and automated engagement. Clofast bridges Adobe behavioral triggers with sales pipelines for real-time lead routing.',
        protocols: ['Experience Platform API', 'Marketo REST', 'Adobe I/O'],
        syncFrequency: 'Event-driven Real-time',
        authType: 'Adobe IMS OAuth 2.0',
        supportedObjects: ['Lead Activities', 'Audiences', 'Campaign Triggers', 'Segment Definitions', 'Person Records'],
        color: '#eb1000',
        accentColor: '#ffe5e3',
        badgeBg: '#fff0ef',
        status: 'active',
        pingMs: 22,
        eventsPerMin: 3450,
        samplePayload: {
          journeyId: 'jny_77401_enterprise_webinar',
          visitorId: 'mc_vis_88291039',
          scoreIncrement: 35,
          engagementLevel: 'High_Intent_Buyer',
          action: 'Requested_Product_Demo',
          routedToSfdcLeadId: '00Q8c00000demo99'
        }
      }
    ]
  },
  {
    id: 'erp',
    title: 'ERP SYSTEMS',
    color: '#3b82f6', // Royal Blue
    description: 'Enterprise resource planning, financial ledgers, inventory balances, purchase orders, and global multi-subsidiary governance.',
    iconName: 'Building2',
    companies: [
      {
        id: 'netsuite',
        name: 'Oracle NetSuite',
        category: 'erp',
        categoryTitle: 'ERP SYSTEMS',
        tagline: 'Unified cloud ERP, accounting, inventory, and order fulfillment engine',
        description: 'Oracle NetSuite is the standard for high-growth enterprise financials, inventory reconciliation, and billing. Clofast automates sales order creation from CRMs, payment reconciliations, and bi-directional item catalog synchronizations.',
        protocols: ['SuiteTalk REST Web Services', 'SuiteQL', 'TBA (Token-Based Auth)'],
        syncFrequency: 'Real-time & Batch Queue',
        authType: 'Token-Based Authentication (OAuth 1.0a HMAC-SHA256)',
        supportedObjects: ['SalesOrders', 'Invoices', 'Customers', 'InventoryItems', 'PurchaseOrders', 'JournalEntries'],
        color: '#cc0000',
        accentColor: '#fde8e8',
        badgeBg: '#fff2f2',
        status: 'active',
        pingMs: 28,
        eventsPerMin: 6120,
        samplePayload: {
          recordType: 'salesOrder',
          internalId: '849204',
          tranId: 'SO-2026-1109',
          entity: { id: '3490', refName: 'Acme Cloud Dynamics' },
          total: 18450.0,
          currency: 'USD',
          status: 'Pending Fulfillment',
          orderLinesCount: 4
        }
      },
      {
        id: 'microsoft-dynamics',
        name: 'Microsoft Dynamics 365',
        category: 'erp',
        categoryTitle: 'ERP SYSTEMS',
        tagline: 'Intelligent business applications connecting finance, supply chain, and operations',
        description: 'Microsoft Dynamics 365 bridges enterprise finance, manufacturing, and supply chain. Clofast integrates Dynamics Business Central and Finance & Operations with CRMs and logistics networks via Azure-secured conduits.',
        protocols: ['OData v4', 'Dataverse Web API', 'Azure Service Bus'],
        syncFrequency: 'Real-time Webhook & Queued Microbatches',
        authType: 'Microsoft Entra ID (Azure AD) OAuth 2.0',
        supportedObjects: ['SalesInvoices', 'Items', 'Vendors', 'GeneralLedger', 'Customers', 'ShipmentHeaders'],
        color: '#0078d4',
        accentColor: '#e0f0fd',
        badgeBg: '#eef7ff',
        status: 'active',
        pingMs: 19,
        eventsPerMin: 5400,
        samplePayload: {
          odataContext: '$metadata#salesInvoices',
          invoiceNumber: 'INV-MSD-94812',
          postingDate: '2026-11-12T08:30:00Z',
          customerNumber: 'CUST-8022',
          totalAmountExcludingTax: 32000.0,
          taxAmount: 2880.0,
          paymentTerms: 'NET30'
        }
      },
      {
        id: 'sap',
        name: 'SAP',
        category: 'erp',
        categoryTitle: 'ERP SYSTEMS',
        tagline: 'Mission-critical enterprise core powering global supply chains and governance',
        description: 'SAP S/4HANA is the backbone of global enterprise logistics, material management, and corporate finance. Clofast provides certified IDoc, OData, and RFC connectors to link SAP seamlessly with modern SaaS applications.',
        protocols: ['OData v2/v4', 'SAP BAPI / RFC', 'IDoc via HTTP/AS2', 'SAP Event Mesh'],
        syncFrequency: 'Near Real-time & High-volume Batch',
        authType: 'X.509 Client Certificates / OAuth 2.0',
        supportedObjects: ['Materials (MM)', 'Sales Orders (SD)', 'Invoices (FI/CO)', 'Deliveries (LE)', 'Business Partners'],
        color: '#003366',
        accentColor: '#e0ecf8',
        badgeBg: '#eef5fc',
        status: 'active',
        pingMs: 31,
        eventsPerMin: 7800,
        samplePayload: {
          s4DocType: 'BUS2032',
          salesOrderNumber: '0040182901',
          salesOrg: '1000',
          distributionChannel: '10',
          netValue: 125400.0,
          currency: 'EUR',
          orderStatus: 'Released_For_Production'
        }
      }
    ]
  },
  {
    id: 'ecommerce',
    title: 'E-COMMERCE',
    color: '#06b6d4', // Cyan
    description: 'Omnichannel storefronts, catalog distribution, high-velocity order routing, and real-time inventory allocation.',
    iconName: 'ShoppingBag',
    companies: [
      {
        id: 'shopify',
        name: 'Shopify',
        category: 'ecommerce',
        categoryTitle: 'E-COMMERCE',
        tagline: 'High-speed global commerce platform powering millions of retail storefronts',
        description: 'Shopify powers modern consumer and B2B eCommerce. Clofast automates order ingestion into ERPs, pushes real-time inventory counts back to store locations, and logs buyer contacts into sales CRMs.',
        protocols: ['Admin GraphQL API', 'Storefront API', 'Webhook Subscriptions'],
        syncFrequency: 'Sub-second Webhooks',
        authType: 'Custom App Access Token (OAuth)',
        supportedObjects: ['Orders', 'Draft Orders', 'Products', 'Variants', 'InventoryLevels', 'Customers'],
        color: '#95bf47',
        accentColor: '#f1f8e8',
        badgeBg: '#f6fbf0',
        status: 'active',
        pingMs: 12,
        eventsPerMin: 12400,
        samplePayload: {
          topic: 'orders/create',
          id: 5938492019,
          order_number: 10482,
          total_price: '489.50',
          currency: 'USD',
          financial_status: 'paid',
          line_items_count: 3,
          customer_email: 'enterprise.buyer@summit.io'
        }
      },
      {
        id: 'magento',
        name: 'Magento',
        category: 'ecommerce',
        categoryTitle: 'E-COMMERCE',
        tagline: 'Adobe Commerce robust platform for complex multi-store and wholesale commerce',
        description: 'Magento (Adobe Commerce) excels at high-complexity catalogs, custom pricing matrices, and B2B quote-to-order workflows. Clofast handles heavy catalog updates and customer group pricing synchronizations.',
        protocols: ['REST API', 'GraphQL', 'RabbitMQ Message Queues'],
        syncFrequency: 'Real-time Event + Hourly Differential',
        authType: 'Integration Bearer Tokens / OAuth 1.0a',
        supportedObjects: ['Catalog Products', 'B2B Company Accounts', 'Orders', 'Credit Memos', 'Shipments'],
        color: '#f26322',
        accentColor: '#fef0e9',
        badgeBg: '#fff6f2',
        status: 'active',
        pingMs: 25,
        eventsPerMin: 4100,
        samplePayload: {
          entity_id: '49102',
          increment_id: 'MAG-902410',
          grand_total: 6240.0,
          customer_group_id: 4,
          status: 'processing',
          payment_method: 'purchaseorder',
          warehouse_code: 'WH_CENTRAL_01'
        }
      },
      {
        id: 'bigcommerce',
        name: 'BigCommerce',
        category: 'ecommerce',
        categoryTitle: 'E-COMMERCE',
        tagline: 'Open SaaS enterprise commerce with headless flexibility and multi-storefront scale',
        description: 'BigCommerce delivers high-throughput commerce with open APIs. Clofast synchronizes multi-channel product variants, real-time stock levels, customer segments, and order data across global ERP instances.',
        protocols: ['V3 REST API', 'GraphQL Storefront', 'Webhooks'],
        syncFrequency: 'Real-time Webhook',
        authType: 'API Account Access Token',
        supportedObjects: ['Products', 'SKUs', 'Orders', 'Coupons', 'Channels', 'Shipping Addresses'],
        color: '#121118',
        accentColor: '#e6e6e8',
        badgeBg: '#f2f2f4',
        status: 'active',
        pingMs: 16,
        eventsPerMin: 5200,
        samplePayload: {
          scope: 'store/order/created',
          data: { id: 182049 },
          subtotal_ex_tax: '1299.00',
          payment_status: 'captured',
          channel_id: 1,
          sync_destination: 'Salesforce_Opportunity'
        }
      }
    ]
  },
  {
    id: 'payments',
    title: 'PAYMENTS',
    color: '#10b981', // Emerald
    description: 'Payment orchestration, instant settlement reconciliation, card network tokens, and automated dispute resolution.',
    iconName: 'CreditCard',
    companies: [
      {
        id: 'visa',
        name: 'Visa',
        category: 'payments',
        categoryTitle: 'PAYMENTS',
        tagline: 'Global card network settlement, tokenization, and fraud risk analytics',
        description: 'Visa processes hundreds of millions of worldwide transactions daily. Clofast interfaces with Visa Developer Platform APIs for tokenized payment method updates, account updater notifications, and settlement matching.',
        protocols: ['Visa Direct REST', 'Visa Developer APIs', 'Mutual TLS (mTLS)'],
        syncFrequency: 'Real-time Transactional',
        authType: 'Two-Way SSL / Certificate + API Key',
        supportedObjects: ['Payment Tokens', 'Settlement Records', 'Disputes', 'Authorization Events', 'Card Metadata'],
        color: '#1a1f71',
        accentColor: '#e5e7f4',
        badgeBg: '#eef0fa',
        status: 'active',
        pingMs: 9,
        eventsPerMin: 18400,
        samplePayload: {
          transactionIdentifier: 'VIS_AUTH_9481029381',
          networkApprovalCode: '891048',
          cardBrand: 'Visa Infinite Enterprise',
          amount: 2450.0,
          currency: '840',
          riskScore: 2,
          settlementDate: '2026-11-12'
        }
      },
      {
        id: 'paypal',
        name: 'PayPal',
        category: 'payments',
        categoryTitle: 'PAYMENTS',
        tagline: 'Ubiquitous digital wallet, cross-border payment gateway, and payout network',
        description: 'PayPal powers international digital wallet transactions and merchant merchant processing. Clofast reconciles PayPal capture webhooks with ERP accounts receivable and customer order history.',
        protocols: ['REST v2 Checkout', 'Webhooks', 'Payouts API'],
        syncFrequency: 'Real-time Webhook',
        authType: 'OAuth 2.0 Client Credentials',
        supportedObjects: ['Captures', 'Refunds', 'Disputes', 'Subscriptions', 'Payout Batches'],
        color: '#003087',
        accentColor: '#e0eaf6',
        badgeBg: '#edf3fb',
        status: 'active',
        pingMs: 15,
        eventsPerMin: 7600,
        samplePayload: {
          event_type: 'PAYMENT.CAPTURE.COMPLETED',
          id: 'WH-89102-PP',
          resource: {
            id: 'CAP_88190391',
            amount: { value: '890.00', currency_code: 'USD' },
            seller_receivable_breakdown: { fee: '26.11', net: '863.89' }
          }
        }
      },
      {
        id: 'stripe',
        name: 'Stripe',
        category: 'payments',
        categoryTitle: 'PAYMENTS',
        tagline: 'Modern financial infrastructure for global Internet commerce and billing',
        description: 'Stripe delivers programmable money, recurring subscription billing, and multi-currency payouts. Clofast synchronizes Stripe charges, invoice paid events, customer tax codes, and dispute events straight into ERP general ledgers.',
        protocols: ['Stripe REST API', 'Webhook Signatures', 'Stripe Events SDK'],
        syncFrequency: 'Instantaneous Webhooks',
        authType: 'Restricted Secret API Keys',
        supportedObjects: ['PaymentIntents', 'Charges', 'Invoices', 'Subscriptions', 'Customers', 'Disputes'],
        color: '#635bff',
        accentColor: '#efefff',
        badgeBg: '#f5f5ff',
        status: 'active',
        pingMs: 11,
        eventsPerMin: 14200,
        samplePayload: {
          id: 'evt_1O8xK42eZvKYlo2CLp',
          type: 'invoice.payment_succeeded',
          data: {
            object: {
              id: 'in_1O8xK42eZvKYlo2C',
              customer: 'cus_P0q7XvM2lQ',
              amount_paid: 1250000,
              currency: 'usd',
              status: 'paid',
              paid_at: 1794464634
            }
          }
        }
      }
    ]
  },
  {
    id: 'media',
    title: 'MEDIA & DOCUMENTS',
    color: '#8b5cf6', // Violet
    description: 'Digital asset management (DAM), dynamic PDF document assembly, contract archival, and rich media streaming links.',
    iconName: 'FileSpreadsheet',
    companies: [
      {
        id: 'image-gallery',
        name: 'Image Gallery',
        category: 'media',
        categoryTitle: 'MEDIA & DOCUMENTS',
        tagline: 'High-fidelity media repository and digital asset management (DAM) engine',
        description: 'Enterprise image asset management connecting product photography, CDN transforms, and SKU associations. Clofast synchronizes approved high-res imagery and metadata across eCommerce catalogs and marketing campaigns.',
        protocols: ['S3 Compatible Object Store', 'CDN Invalidation API', 'Metadata GraphQL'],
        syncFrequency: 'Real-time Asset Ingestion',
        authType: 'AWS IAM / S3 Pre-signed URLs',
        supportedObjects: ['Image Master', 'Variants (WebP/AVIF)', 'Color Swatches', 'Metadata Tags', 'License Rights'],
        color: '#ec4899',
        accentColor: '#fdecf5',
        badgeBg: '#fef3f9',
        status: 'active',
        pingMs: 14,
        eventsPerMin: 3800,
        samplePayload: {
          assetId: 'IMG_SKU_8921_HERO',
          format: 'image/webp',
          dimensions: '3840x2160',
          cdnUrl: 'https://cdn.clofast.net/assets/sku8921_master.webp',
          transformedVariants: ['1200w', '800w', '400w_thumb'],
          checksumSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        }
      },
      {
        id: 'pdf',
        name: 'PDF',
        category: 'media',
        categoryTitle: 'MEDIA & DOCUMENTS',
        tagline: 'Automated PDF invoice generation, packing slips, and signed sales contracts',
        description: 'Automated document assembly pipeline for generating pixel-perfect invoices, international customs documentation, bills of lading, and signed sales agreements. Clofast attaches generated PDFs to CRM deal records and ERP transactions.',
        protocols: ['Headless Chromium Render', 'PDF/A Compliance Engine', 'REST Document API'],
        syncFrequency: 'On-demand Pipeline Trigger',
        authType: 'HMAC Service Token',
        supportedObjects: ['Commercial Invoices', 'Packing Lists', 'Master Service Agreements (MSA)', 'NDAs', 'Audit Certificates'],
        color: '#dc2626',
        accentColor: '#fee2e2',
        badgeBg: '#fef2f2',
        status: 'active',
        pingMs: 17,
        eventsPerMin: 2900,
        samplePayload: {
          documentId: 'DOC_PDF_2026_9481',
          template: 'enterprise_invoice_multicurrency_v3',
          pageCount: 3,
          fileSizeKb: 248.6,
          pdfStandard: 'PDF/A-3b Archival',
          digitalSignatureValid: true,
          attachedToCrmOpportunity: '0068c00000abc12AAA'
        }
      },
      {
        id: 'video',
        name: 'Video',
        category: 'media',
        categoryTitle: 'MEDIA & DOCUMENTS',
        tagline: 'Video hosting, adaptive HLS transcoding, and product demonstration streaming',
        description: 'Rich multimedia distribution engine streaming video tutorials, product walkthroughs, and customer demo recordings. Clofast associates customer video engagement metrics directly into CRM lead scores.',
        protocols: ['HLS / DASH Streams', 'Transcoding Webhooks', 'Video Cloud API'],
        syncFrequency: 'Event-driven Transcode Notification',
        authType: 'Signed Bearer Token',
        supportedObjects: ['Product Demos', 'Webinar Archives', 'Transcode Profiles', 'Viewer Analytics', 'Closed Captions (VTT)'],
        color: '#9333ea',
        accentColor: '#f3e8ff',
        badgeBg: '#faf5ff',
        status: 'active',
        pingMs: 16,
        eventsPerMin: 1850,
        samplePayload: {
          videoId: 'VID_CLOFAST_DEMO_4K',
          durationSeconds: 184,
          resolutionsAvailable: ['4K_2160p', '1080p', '720p', '480p'],
          hlsManifestUrl: 'https://stream.clofast.net/manifest/vid4k.m3u8',
          viewerWatchPercentage: 92.4,
          leadAttributionId: 'hs_lead_882910'
        }
      }
    ]
  },
  {
    id: 'data',
    title: 'DATA & INTEGRATIONS',
    color: '#0ea5e9', // Sky/Indigo
    description: 'Protocol translation, EDI compliance, low-latency REST/GraphQL conduits, and hierarchical XML transformation.',
    iconName: 'Network',
    companies: [
      {
        id: 'edi',
        name: 'EDI',
        category: 'data',
        categoryTitle: 'DATA & INTEGRATIONS',
        tagline: 'Electronic Data Interchange for ANSI X12, EDIFACT, and AS2 trading compliance',
        description: 'Mission-critical B2B commerce protocol connecting global retailers, suppliers, and logistics carriers. Clofast translates ANSI X12 (850 Purchase Order, 856 Shipping Notice, 810 Invoice) and EDIFACT directly into CRM & ERP payloads.',
        protocols: ['AS2 (RFC 4130)', 'SFTP / FTPS', 'ANSI X12 / EDIFACT / TRADACOMS'],
        syncFrequency: 'Continuous AS2 Listener',
        authType: 'AS2 Partner X.509 Certificate Encryption',
        supportedObjects: ['EDI 850 (Purchase Order)', 'EDI 855 (PO Ack)', 'EDI 856 (ASN)', 'EDI 810 (Invoice)', 'EDI 997 (FA)'],
        color: '#0284c7',
        accentColor: '#e0f2fe',
        badgeBg: '#f0f9ff',
        status: 'active',
        pingMs: 20,
        eventsPerMin: 6900,
        samplePayload: {
          ediTransactionSet: '850',
          functionalGroup: 'PO',
          interchangeControlNumber: '000049281',
          senderId: 'DUNS_001928401',
          receiverId: 'CLOFAST_HUB_99',
          totalLineItems: 14,
          rawEdiStatus: 'Parsed_To_Canonical_JSON'
        }
      },
      {
        id: 'api',
        name: 'API',
        category: 'data',
        categoryTitle: 'DATA & INTEGRATIONS',
        tagline: 'High-throughput programmable REST, GraphQL, and Webhook enterprise gateway',
        description: 'Universal programmable integration gateway handling token rotation, rate-limit backoff, request deduplication, and zero-latency routing. Clofast exposes unified GraphQL & REST endpoints across all connected systems.',
        protocols: ['REST (OpenAPI 3.1)', 'GraphQL', 'gRPC', 'Webhooks'],
        syncFrequency: 'Real-time (<10ms P99)',
        authType: 'mTLS / OAuth 2.0 / API Keys with IP Whitelisting',
        supportedObjects: ['GraphQL Schema', 'OpenAPI Specs', 'Webhook Subscriptions', 'Rate Limit Policies', 'Audit Logs'],
        color: '#0d9488',
        accentColor: '#ccfbf1',
        badgeBg: '#f0fdfa',
        status: 'active',
        pingMs: 8,
        eventsPerMin: 24800,
        samplePayload: {
          gatewayRoute: '/v1/crm/opportunities/sync',
          httpMethod: 'POST',
          latencyMs: 7.8,
          responseCode: 200,
          rateLimitRemaining: 9890,
          idempotencyKey: 'idem_948190284',
          transformedFields: 28
        }
      },
      {
        id: 'xml',
        name: 'XML',
        category: 'data',
        categoryTitle: 'DATA & INTEGRATIONS',
        tagline: 'Hierarchical XML, cXML, and schema-validated enterprise legacy translation',
        description: 'Structured enterprise XML data exchange supporting cXML for procurement, OAGIS, and legacy mainframe feeds. Clofast automatically validates XSD schemas, transforms nested trees, and converts between XML and modern JSON.',
        protocols: ['cXML PunchOut', 'SOAP 1.2 / WSDL', 'XML-RPC', 'XSLT 3.0'],
        syncFrequency: 'Real-time & Batch Queue',
        authType: 'Basic Auth / Shared Secret / XML-DSig',
        supportedObjects: ['cXML PunchOutOrderMessage', 'SOAP Envelopes', 'XSD Schemas', 'XSLT Stylesheets', 'Batch Dumps'],
        color: '#0891b2',
        accentColor: '#cffafe',
        badgeBg: '#ecfeff',
        status: 'active',
        pingMs: 18,
        eventsPerMin: 5100,
        samplePayload: {
          rootElement: 'cXML',
          doctype: 'cXML.dtd',
          timestamp: '2026-11-12T02:32:00Z',
          payloadId: '9841284.1794464634@supplier.com',
          buyerCookie: 'cookie_session_9948',
          validationResult: 'XSD_Schema_Valid'
        }
      }
    ]
  }
];

export const INITIAL_SYNC_LOGS: SyncLogEvent[] = [
  {
    id: 'log-101',
    timestamp: 'Just now',
    source: 'Salesforce',
    target: 'Oracle NetSuite',
    category: 'crm',
    recordType: 'Opportunity -> SalesOrder',
    recordId: 'OPP-8921 -> SO-4819',
    status: 'success',
    latencyMs: 14,
    payloadSizeKb: 18.4
  },
  {
    id: 'log-102',
    timestamp: '2s ago',
    source: 'HubSpot',
    target: 'Salesforce',
    category: 'crm',
    recordType: 'MQL Lead Sync & Attribute',
    recordId: 'HS-CONT-9401',
    status: 'success',
    latencyMs: 11,
    payloadSizeKb: 8.2
  },
  {
    id: 'log-103',
    timestamp: '5s ago',
    source: 'Shopify',
    target: 'Stripe',
    category: 'ecommerce',
    recordType: 'Order Payment Authorization',
    recordId: 'ORD-#10482',
    status: 'success',
    latencyMs: 9,
    payloadSizeKb: 12.1
  },
  {
    id: 'log-104',
    timestamp: '8s ago',
    source: 'EDI (X12 850)',
    target: 'SAP S/4HANA',
    category: 'data',
    recordType: 'Purchase Order EDI 850 Ingestion',
    recordId: 'EDI-DOC-98410',
    status: 'success',
    latencyMs: 23,
    payloadSizeKb: 45.6
  },
  {
    id: 'log-105',
    timestamp: '12s ago',
    source: 'Salesforce',
    target: 'PDF Engine',
    category: 'media',
    recordType: 'Invoice PDF Rendering & Archive',
    recordId: 'INV-PDF-8849',
    status: 'success',
    latencyMs: 28,
    payloadSizeKb: 212.0
  },
  {
    id: 'log-106',
    timestamp: '15s ago',
    source: 'Microsoft Dynamics 365',
    target: 'HubSpot',
    category: 'erp',
    recordType: 'Customer Balance & AR Sync',
    recordId: 'AR-CUST-8022',
    status: 'success',
    latencyMs: 16,
    payloadSizeKb: 14.8
  },
  {
    id: 'log-107',
    timestamp: '19s ago',
    source: 'Adobe Marketing',
    target: 'API Gateway',
    category: 'crm',
    recordType: 'Behavioral Lead Score Trigger',
    recordId: 'ADOBE-BEH-7740',
    status: 'success',
    latencyMs: 12,
    payloadSizeKb: 6.4
  },
  {
    id: 'log-108',
    timestamp: '24s ago',
    source: 'BigCommerce',
    target: 'Oracle NetSuite',
    category: 'ecommerce',
    recordType: 'Multi-storefront Order Routing',
    recordId: 'BC-ORD-182049',
    status: 'success',
    latencyMs: 21,
    payloadSizeKb: 24.3
  }
];

export const PIPELINE_METRICS: PipelineMetric[] = [
  { metric: 'Total Synced Revenue', value: '$84.2M', change: '+24.6% MoM', positive: true },
  { metric: 'Live Active Connectors', value: '18 / 18', change: '100% Operational', positive: true },
  { metric: 'Daily Data Throughput', value: '14.8M Events', change: '+18.2% vs avg', positive: true },
  { metric: 'Avg Sync Latency (P99)', value: '14.2 ms', change: '-4.1 ms faster', positive: true }
];
