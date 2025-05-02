<?php

namespace App\Controller;

use App\Entity\ProductAllData;
use App\Entity\Warehouse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/data', name: 'api_data_')]
class ApiProductAllDataController extends AbstractController {
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $entityManager): JsonResponse
    {
        $allProductData = $entityManager->getRepository(ProductAllData::class)->findAll();
        $data = [];

        foreach ($allProductData as $productData) {
            $data[] = [
                'id' => $productData->getId(),
                'warehouse' => $productData->getWarehouse()->getId(),
                'name' => $productData->getName(),
                'brand' => $productData->getBrand(),
                'price' => $productData->getPrice(),
                'purchase_price' => $productData->getPurchasePrice(),
                'stock' => $productData->getStock(),
                'product_type' => $productData->getProductType(),
                'entry_date' => $productData->getEntryDate()->format('Y-m-d H:i:s'),
                'expiration_date' => $productData->getExpirationDate()?->format('Y-m-d H:i:s'),
                'weight' => $productData->getWeight(),
                'dimensions' => $productData->getDimensions(),
                'product_photo' => $productData->getProductPhoto(),
            ];
        }

        return $this->json($data);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset(
            $data['warehouse'],
            $data['name'],
            $data['brand'],
            $data['price'],
            $data['stock'],
            $data['product_type'],
            $data['entry_date'],
            $data['weight'],
            $data['dimensions']
        )) {
            return $this->json(['error' => 'Missing required fields'], 400);
        }


        $productData = new ProductAllData();
        $warehouse = $entityManager->getRepository(Warehouse::class)->find($data['warehouse']);
        if (!$warehouse) {
            return $this->json(['error' => 'Warehouse not found'], 404);
        }
        $productData->setWarehouse($warehouse);
        $productData->setName($data['name']);
        $productData->setBrand($data['brand']);
        $productData->setPrice($data['price']);
        $productData->setPurchasePrice($data['purchase_price']);
        $productData->setStock($data['stock']);
        $productData->setProductType($data['product_type']);
        $productData->setEntryDate(new \DateTime($data['entry_date']));
        $productData->setExpirationDate(new \DateTime($data['expiration_date']));
        $productData->setWeight($data['weight']);
        $productData->setDimensions($data['dimensions']);

        $entityManager->persist($productData);
        $entityManager->flush();

        return $this->json(['message' => 'User created successfully'], 201);
    }

    #[Route('/user/{userId}', name: 'get_products_by_user', methods: ['GET'])]
public function getProductsByUser(int $userId, EntityManagerInterface $entityManager): JsonResponse
{
    // Obtener todos los almacenes asociados al usuario
    $warehouses = $entityManager->getRepository(Warehouse::class)
        ->findBy(['user' => $userId]);  // Obtenemos todos los almacenes del usuario

    if (!$warehouses) {
        return $this->json(['error' => 'No warehouses found for this user'], 404);
    }

    // Obtener los productos asociados a todos los almacenes
    $products = $entityManager->getRepository(ProductAllData::class)
        ->findBy(['warehouse' => $warehouses]);  // Buscar productos en todos los almacenes del usuario

    if (!$products) {
        return $this->json(['message' => 'No products found for this user'], 404);
    }

    // Preparar los datos de los productos
    $data = [];
    foreach ($products as $productData) {
        $data[] = [
            'id' => $productData->getId(),
            'warehouse' => $productData->getWarehouse()->getId(),
            'name' => $productData->getName(),
            'brand' => $productData->getBrand(),
            'price' => $productData->getPrice(),
            'purchase_price' => $productData->getPurchasePrice(),
            'stock' => $productData->getStock(),
            'product_type' => $productData->getProductType(),
            'entry_date' => $productData->getEntryDate()->format('Y-m-d H:i:s'),
            'expiration_date' => $productData->getExpirationDate()?->format('Y-m-d H:i:s'),
            'weight' => $productData->getWeight(),
            'dimensions' => $productData->getDimensions(),
            'product_photo' => $productData->getProductPhoto(),
        ];
    }

    return $this->json($data);
}


    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse {
        if (!isset($id)) {
            return $this->json(['error' => 'Missing required fields'], 400);
        }

        $productData = $entityManager->getRepository(ProductAllData::class)->find($id);
        $entityManager->remove($productData);
        $entityManager->flush();
        return $this->json(['message' => 'User deleted successfully'], 200);
    }
}
