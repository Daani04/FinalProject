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
use Symfony\Component\HttpFoundation\Response;

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

        // Verificación de los datos requeridos
        if (!isset($data['product'], $data['warehouse'], $data['quantity'], $data['sale_date'])) {
            return $this->json(['error' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }

        // Validación de la cantidad
        if (!is_numeric($data['quantity']) || $data['quantity'] <= 0) {
            return $this->json(['error' => 'Invalid quantity'], Response::HTTP_BAD_REQUEST);
        }

        // Validación de la fecha
        try {
            $saleDate = new \DateTime($data['sale_date']);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Invalid sale date'], Response::HTTP_BAD_REQUEST);
        }

        // Buscar el producto y el almacén
        $product = $entityManager->getRepository(ProductAllData::class)->find($data['product']);
        $warehouse = $entityManager->getRepository(Warehouse::class)->find($data['warehouse']);

        if (!$product) {
            return $this->json(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        if (!$warehouse) {
            return $this->json(['error' => 'Warehouse not found'], Response::HTTP_NOT_FOUND);
        }

        // Crear la venta
        $sale = new ProductSold();
        $sale->setProductData($product);
        $sale->setWarehouse($warehouse);
        $sale->setQuantity($data['quantity']);
        $sale->setSaleDate($saleDate);

        // Persistir la venta
        $entityManager->persist($sale);
        $entityManager->flush();

        return $this->json(['message' => 'Sale recorded successfully'], Response::HTTP_CREATED);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $sale = $entityManager->getRepository(ProductSold::class)->find($id);

        if (!$sale) {
            return $this->json(['error' => 'Sale not found'], Response::HTTP_NOT_FOUND);
        }

        // Eliminar la venta
        $entityManager->remove($sale);
        $entityManager->flush();

        return $this->json(['message' => 'Sale deleted successfully'], Response::HTTP_OK);
    }
}
