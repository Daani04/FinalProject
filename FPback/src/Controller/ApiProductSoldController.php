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

        if (!isset($data['product'], $data['warehouse'], $data['quantity'], $data['sale_date'])) {
            return $this->json(['error' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }

        if (!is_numeric($data['quantity']) || $data['quantity'] <= 0) {
            return $this->json(['error' => 'Invalid quantity'], Response::HTTP_BAD_REQUEST);
        }

        try {
            $saleDate = new \DateTime($data['sale_date']);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Invalid sale date'], Response::HTTP_BAD_REQUEST);
        }

        $product = $entityManager->getRepository(ProductAllData::class)->find($data['product']);
        $warehouse = $entityManager->getRepository(Warehouse::class)->find($data['warehouse']);

        if (!$product) {
            return $this->json(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        if (!$warehouse) {
            return $this->json(['error' => 'Warehouse not found'], Response::HTTP_NOT_FOUND);
        }

        if ($product->getStock() < $data['quantity']) {
            return $this->json(['error' => 'Not enough stock'], Response::HTTP_BAD_REQUEST);
        }

        $product->setStock($product->getStock() - $data['quantity']);

        $sale = new ProductSold();
        $sale->setProductData($product);
        $sale->setWarehouse($warehouse);
        $sale->setQuantity($data['quantity']);
        $sale->setSaleDate($saleDate);

        if ($product->getPurchasePrice() !== null) {
            $sale->setPurchasePrice($product->getPurchasePrice());
        }

        if ($product->getName() !== null) {
            $sale->setName($product->getName());
        }

        if ($product->getBrand() !== null) {
            $sale->setBrand($product->getBrand());
        }

        if ($product->getPrice() !== null) {
            $sale->setPrice($product->getPrice());
        }

        if ($product->getProductType() !== null) {
            $sale->setProductType($product->getProductType());
        }

        if ($product->getExpirationDate() !== null) {
            $sale->setExpirationDate($product->getExpirationDate());
        }

        if ($product->getEntryDate() !== null) {
            $sale->setEntryDate($product->getEntryDate());
        }

        if ($product->getBarcode() !== null) {
            $sale->setBarcode($product->getBarcode());
        }

        $entityManager->persist($sale);
        $entityManager->persist($product);
        $entityManager->flush();

        return $this->json(['message' => 'Sale recorded successfully'], Response::HTTP_CREATED);
    }

    #[Route('/user/{userId}', name: 'sales_by_user', methods: ['GET'])]
    public function getSalesByUser(int $userId, EntityManagerInterface $entityManager): JsonResponse
    {
        // Obtener todos los almacenes asociados al usuario
        $warehouses = $entityManager->getRepository(Warehouse::class)
            ->findBy(['user' => $userId]);

        if (!$warehouses) {
            return $this->json(['error' => 'No warehouses found for this user'], Response::HTTP_NOT_FOUND);
        }

        // Obtener todas las ventas asociadas a los almacenes del usuario
        $sales = $entityManager->getRepository(ProductSold::class)
            ->findBy(['warehouse' => $warehouses]);

        if (!$sales) {
            return $this->json(['message' => 'No sales found for this user'], Response::HTTP_NOT_FOUND);
        }

        // Preparar los datos de las ventas
        $data = [];
        foreach ($sales as $sale) {
            $data[] = [
                'id' => $sale->getId(),
                'product' => $sale->getProductData()->getId(),
                'warehouse' => $sale->getWarehouse()->getId(),
                'quantity' => $sale->getQuantity(),
                'sale_date' => $sale->getSaleDate()->format('Y-m-d H:i:s'),
                'name' => $sale->getName(),
                'brand' => $sale->getBrand(),
                'price' => $sale->getPrice(),
                'purchase_price' => $sale->getPurchasePrice(),
                'product_type' => $sale->getProductType(),
                'entry_date' => $sale->getEntryDate()?->format('Y-m-d H:i:s'),
                'expiration_date' => $sale->getExpirationDate()?->format('Y-m-d H:i:s'),
                'barcode' => $sale->getBarcode(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $sale = $entityManager->getRepository(ProductSold::class)->find($id);

        if (!$sale) {
            return $this->json(['error' => 'Sale not found'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($sale);
        $entityManager->flush();

        return $this->json(['message' => 'Sale deleted successfully'], Response::HTTP_OK);
    }
}
