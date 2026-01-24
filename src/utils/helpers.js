export const formatPrice = (price) => {
  return new Intl.NumberFormat('mn-MN').format(price) + '₮';
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getStatusColor = (status) => {
  switch(status) {
    case 'pending': return 'bg-yellow-100 text-yellow-800';
    case 'processing': return 'bg-blue-100 text-blue-800';
    case 'completed': return 'bg-green-100 text-green-800';
    case 'cancelled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusText = (status) => {
  switch(status) {
    case 'pending': return 'Хүлээгдэж байна';
    case 'processing': return 'Боловсруулж байна';
    case 'completed': return 'Дууссан';
    case 'cancelled': return 'Цуцлагдсан';
    default: return status;
  }
};