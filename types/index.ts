// types/index.ts
export interface Product {
  id: string;
  no: string;
  name: string;
  itemType: string;
  unitPrice: number;
  unit1Name: string;
  category: any;
  image?: string;
  imageUrlThumb?: string;
  availableToSell?: number;
  minimumSellingQuantity?: number;
}

export interface ProductDetail extends Product {
  shortName?: string;
  itemTypeName?: string;
  cost: number;
  vendorPrice: number;
  unit1: {
    id: string | null;
    name: string | null;
  };
  balance: number;
  balanceInUnit?: any;
  controlQuantity: boolean;
  minimumQuantity: number;
  itemCategory: {
    id: string | null;
    name: string | null;
  };
  percentTaxable: number;
  suspended: boolean;
  onSales: number;
  notes?: string;
  images: ProductImage[];
  sellingPrices: SellingPrice[];
  warehouses: Warehouse[];
  upcNo?: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  itemBrand?: any;
  preferedVendor?: any;
}

export interface ProductImage {
  id: string | null;
  fileName: string | null;
  thumbnailPath: string | null;
  originalName: string | null;
  seq: number;
}

export interface SellingPrice {
  price: number;
  effectiveDate: string | null;
  effectiveDateView: string | null;
  unit: {
    id: string | null;
    name: string | null;
  };
  priceCategory: {
    id: string | null;
    name: string | null;
    defaultCategory: boolean;
  };
  currency: {
    id: string | null;
    code: string | null;
    symbol: string | null;
    name: string | null;
  };
  branch: {
    id: string | null;
    name: string | null;
    defaultBranch: boolean;
  };
}

export interface Warehouse {
  id: string | null;
  name: string | null;
  warehouseName: string | null;
  balance: number;
  balanceUnit: any;
  defaultWarehouse: boolean;
  unit1Quantity: number;
}

export interface CartItem {
  id: string;
  productId: string;
  productNo: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  maxQuantity?: number;
}

export interface Customer {
  id: string | null;
  customerNo: string | null;
  name: string | null;
  email: string | null;
  mobilePhone: string | null;
  billStreet: string | null;
  billCity: string | null;
  billProvince: string | null;
  billCountry: string | null;
  billZipCode: string | null;
  shipStreet: string | null;
  shipCity: string | null;
  shipProvince: string | null;
  shipCountry: string | null;
  shipZipCode: string | null;
  shipSameAsBill: boolean;
  priceCategoryId: string | null;
  termId: string | null;
  balance: number;
}

export interface Order {
  id: string;
  number: string;
  transDate: string;
  customer: {
    id: string;
    customerNo: string;
    name: string;
  };
  total: number;
  status: string;
}

export interface OrderDetail {
  id: string;
  number: string;
  transDate: string;
  shipDate?: string;
  status: string;
  statusName: string;
  customerId: string;
  customer: {
    id: string;
    customerNo: string;
    name: string;
    email?: string;
    mobilePhone?: string;
  };
  toAddress?: string;
  shipAddress: {
    street: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    zipCode: string | null;
  };
  items: OrderItem[];
  subTotal: number;
  totalExpense: number;
  discount: number;
  tax1Amount: number;
  tax2Amount: number;
  totalAmount: number;
  currency: {
    code: string | null;
    symbol: string | null;
  };
  paymentTerm: {
    id: string | null;
    name: string | null;
    netDays: number;
  };
  description?: string;
  poNumber?: string;
}

export interface OrderItem {
  id: string | null;
  seq: number | null;
  itemId: string | null;
  itemNo: string | null;
  itemName: string | null;
  quantity: number;
  unitPrice: number;
  discount?: number;
  totalPrice: number;
  unit?: string;
  notes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    rowCount: number;
  };
}

export interface CustomerFormData {
  name: string;
  transDate: string;
  customerNo?: string;
  mobilePhone?: string;
  email?: string;
  billStreet?: string;
  billCity?: string;
  billProvince?: string;
  billCountry?: string;
  billZipCode?: string;
}