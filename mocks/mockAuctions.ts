import { Auction } from "@/app/types/auction";

export const mockAuctions: Auction[] = [
  {
    id: "auction123",
    lots: [
      {
        id: "auction123-1",
        title: "Mercedes-Benz Trucks Actros 1843 FULL ADR LS",
        description: "",
        startPrice: 50000,
        increment:5000,
        media: [
          {
            id: 1,
            type: "image",
            url: "/media/Mercedes-Benz Trucks Actros 1843 FULL ADR LS 01.png",
            description: "Descripcion Camion 1",
          },
          {
            id: 2,
            type: "image",
            url: "/media/Mercedes-Benz Trucks Actros 1843 FULL ADR LS 02.png",
            description: "Descripcion Camion 2",
          },
          {
            id: 3,
            type: "image",
            url: "/media/Mercedes-Benz Trucks Actros 1843 FULL ADR LS 03.png",
            description: "Descripcion Camion 3",
          },
        ],
      },
      {
        id: "auction123-2",
        title: "Mercedes-Benz Trucks Actros 1846 LS nR 4x2",
        description: "",
        startPrice: 70000,
        increment:7000,
        media: [
          {
            id: 1,
            type: "image",
            url: "/media/Mercedes-Benz Trucks Actros 1846 LS nR 4x2 01.png",
            description: "Descripcion Camion 1",
          },
          {
            id: 2,
            type: "image",
            url: "/media/Mercedes-Benz Trucks Actros 1846 LS nR 4x2 02.png",
            description: "Descripcion Camion 2",
          },
          {
            id: 3,
            type: "image",
            url: "/media/Mercedes-Benz Trucks Actros 1846 LS nR 4x2 03.png",
            description: "Descripcion Camion 3",
          },
        ],
      },
      {
        id: "auction123-3",
        title: "Mercedes-Benz Trucks Atego 1330 LS 4x2",
        description: "",
        startPrice: 100000,
        increment:10000,
        media: [
          {
            id: 1,
            type: "image",
            url: "/media/Mercedes-Benz Trucks Atego 1330 LS 4x2 01.png",
            description: "Descripcion Camion 1",
          },
          {
            id: 2,
            type: "image",
            url: "/media/Mercedes-Benz Trucks Atego 1330 LS 4x2 02.png",
            description: "Descripcion Camion 2",
          },
          {
            id: 3,
            type: "image",
            url: "/media/Mercedes-Benz Trucks Atego 1330 LS 4x2 03.png",
            description: "Descripcion Camion 3",
          },
        ],
      },
    ],
  },
  {
    id: "auction456",
    lots: [
      {
        id: "auction456-1",
        title: "Sierra 3500 HD Denali",
        description: "",
        startPrice: 50000,
        increment:5000,
        media: [
          {
            id: 1,
            type: "image",
            url: "/media/Sierra 3500 HD Denali 01.jpg",
            description: "Descripcion Camion 1",
          },
          {
            id: 2,
            type: "image",
            url: "/media/Sierra 3500 HD Denali 02.avif",
            description: "Descripcion Camion 2",
          },
          {
            id: 3,
            type: "image",
            url: "/media/Sierra 3500 HD Denali 03.avif",
            description: "Descripcion Camion 3",
          },
        ],
      },
      {
        id: "auction456-2",
        title: "Ford F-150",
        description: "",
        startPrice: 70000,
        increment:7000,
        media: [
          {
            id: 1,
            type: "image",
            url: "/media/Ford F-150 01.webp",
            description: "Descripcion Camion 1",
          },
          {
            id: 2,
            type: "image",
            url: "/media/Ford F-150 02.avif",
            description: "Descripcion Camion 2",
          },
          {
            id: 3,
            type: "image",
            url: "/media/Ford F-150 03.avif",
            description: "Descripcion Camion 3",
          },
        ],
      },
      {
        id: "auction456-3",
        title: "Transit-250 Cargo Base",
        description: "",
        startPrice: 100000,
        increment:10000,
        media: [
          {
            id: 1,
            type: "image",
            url: "/media/Transit-250 Cargo Base 01.jpg",
            description: "Descripcion Camion 1",
          },
          {
            id: 2,
            type: "image",
            url: "/media/Transit-250 Cargo Base 02.avif",
            description: "Descripcion Camion 2",
          },
          {
            id: 3,
            type: "image",
            url: "/media/Transit-250 Cargo Base 03.avif",
            description: "Descripcion Camion 3",
          },
        ],
      },
    ],
  },
];
