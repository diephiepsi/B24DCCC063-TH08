import { useState, useEffect } from 'react';

export default () => {
  // 1. Quản lý danh sách điểm đến (Master Data cho Admin và Khám phá)
  const [destinations, setDestinations] = useState<any[]>(() => {
    const saved = localStorage.getItem('th6_destinations');
    if (saved) return JSON.parse(saved);
    // Dữ liệu mẫu ban đầu để giao diện không bị trống
    return [
      {
        id: '1',
        name: 'Vịnh Hạ Long',
        location: 'Quảng Ninh',
        type: 'beach',
        price: 1500000,
        rating: 5,
        time: 8, // Thời gian tham quan dự kiến (giờ)
        foodCost: 500000,
        stayCost: 800000,
        moveCost: 200000,
        image: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=500',
        description: 'Kỳ quan thiên nhiên thế giới với hàng ngàn hòn đảo đá vôi.',
      },
      {
        id: '2',
        name: 'Đỉnh Fansipan',
        location: 'Lào Cai',
        type: 'mountain',
        price: 2500000,
        rating: 4.8,
        time: 12,
        foodCost: 700000,
        stayCost: 1200000,
        moveCost: 600000,
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=500',
        description: 'Nóc nhà Đông Dương với hệ thống cáp treo hiện đại.',
      }
    ];
  });

  // 2. Quản lý lịch trình người dùng đã tạo (Cho yêu cầu 2)
  const [itinerary, setItinerary] = useState<any[]>(() => {
    const saved = localStorage.getItem('th6_itinerary');
    return saved ? JSON.parse(saved) : [];
  });

  // 3. Quản lý ngân sách dự kiến (Cho yêu cầu 3)
  const [budgetLimit, setBudgetLimit] = useState<number>(() => {
    const saved = localStorage.getItem('th6_budget_limit');
    return saved ? Number(saved) : 5000000; // Mặc định 5.000.000 VNĐ
  });

  // --- TỰ ĐỘNG LƯU VÀO LOCAL STORAGE ---
  useEffect(() => {
    localStorage.setItem('th6_destinations', JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem('th6_itinerary', JSON.stringify(itinerary));
  }, [itinerary]);

  useEffect(() => {
    localStorage.setItem('th6_budget_limit', budgetLimit.toString());
  }, [budgetLimit]);

  return {
    // Dữ liệu và hàm cập nhật
    destinations,
    setDestinations,
    itinerary,
    setItinerary,
    budgetLimit,
    setBudgetLimit,
  };
};