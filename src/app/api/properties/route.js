export const GET = async () => {
  const data = [
    {
      id: 1,
      image: "/images/property1.jpg",
      title: "Möhtəşəm 3 otaqlı mənzil",
      type: "Satılır",
      price: 120000,
      location: "Bakı, Nəsimi rayonu",
      area: 120,
      rooms: 3,
      floor: 5,
      totalFloors: 10,
      yearBuilt: 2015,
      description: "Mərkəzi yerdə, bütün infrastruktur yaxınlıqda, təmirli mənzil.",
      agent: { name: "Aysel Abdullayeva", phone: "+994501234567", email: "aysel@example.com" }
    },
    {
      id: 2,
      image: "/images/property2.jpg",
      title: "2 otaqlı mənzil kirayə",
      type: "Kirayə",
      price: 700,
      location: "Bakı, Yasamal rayonu",
      area: 75,
      rooms: 2,
      floor: 3,
      totalFloors: 8,
      yearBuilt: 2010,
      description: "Yasamalda mərkəzə yaxın, əla təmirli mənzil.",
      agent: { name: "Elvin Məmmədov", phone: "+994502345678", email: "elvin@example.com" }
    }
  ];

  return new Response(JSON.stringify(data), { status: 200 });
};
