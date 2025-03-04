<?php

namespace App\Controller;

use App\Entity\ProductSold;
use App\Entity\ProductAllData;
use App\Entity\Warehouse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/sales', name: 'api_sales_')]
class ApiProductSoldController extends AbstractController {
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $entityManager): JsonResponse
    {
        $sales = $entityManager->getRepository(ProductSold::class)->findAll();
        $data = [];

        foreach ($sales as $sale) {
            $data[] = [
                'id' => $sale->getId(),
                'product' => $sale->getProductData()->getId(),
                'warehouse' => $sale->getWarehouse()->getId(),
                'quantity' => $sale->getQuantity(),
                'sale_date' => $sale->getSaleDate()->format('Y-m-d H:i:s'),
            ];
        }

        return $this->json($data);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['product'], $data['warehouse'], $data['quantity'], $data['sale_date'])) {
            return $this->json(['error' => 'Missing required fields'], 400);
        }

        // Buscar el producto y el almacén en la base de datos
        $product = $entityManager->getRepository(ProductAllData::class)->find($data['product']);
        $warehouse = $entityManager->getRepository(Warehouse::class)->find($data['warehouse']);

        if (!$product || !$warehouse) {
            return $this->json(['error' => 'Product or Warehouse not found'], 404);
        }

        $sale = new ProductSold();
        $sale->setProductData($product);
        $sale->setWarehouse($warehouse);
        $sale->setQuantity($data['quantity']);
        $sale->setSaleDate(new \DateTime($data['sale_date']));

        $entityManager->persist($sale);
        $entityManager->flush();

        return $this->json(['message' => 'Sale recorded successfully'], 201);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $sale = $entityManager->getRepository(ProductSold::class)->find($id);

        if (!$sale) {
            return $this->json(['error' => 'Sale not found'], 404);
        }

        $entityManager->remove($sale);
        $entityManager->flush();

        return $this->json(['message' => 'Sale deleted successfully'], 200);
    }
}
