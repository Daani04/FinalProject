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
    
        // Buscar el producto y el almacén
        $product = $entityManager->getRepository(ProductAllData::class)->find($data['product']);
        $warehouse = $entityManager->getRepository(Warehouse::class)->find($data['warehouse']);
    
        // Verificación de existencia del producto
        if (!$product) {
            return $this->json(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }
    
        // Verificación de existencia del almacén
        if (!$warehouse) {
            return $this->json(['error' => 'Warehouse not found'], Response::HTTP_NOT_FOUND);
        }
    
        // Comprobamos si hay suficiente stock (usando getStock())
        if ($product->getStock() < $data['quantity']) {
            return $this->json(['error' => 'Not enough stock'], Response::HTTP_BAD_REQUEST);
        }
    
        // Reducir la cantidad del producto en stock
        $product->setStock($product->getStock() - $data['quantity']);
    
        // Buscar si ya existe una venta registrada para este producto y almacén
        $existingSale = $entityManager->getRepository(ProductSold::class)
            ->findOneBy([
                'productData' => $product,
                'warehouse' => $warehouse
            ]);
    
        if ($existingSale) {
            // Si ya existe una venta, sumamos la cantidad a la venta existente
            $existingSale->setQuantity($existingSale->getQuantity() + $data['quantity']);
            $entityManager->persist($existingSale); 
        } else {
            // Si no existe una venta, creamos una nueva
            $sale = new ProductSold();
            $sale->setProductData($product);
            $sale->setWarehouse($warehouse);
            $sale->setQuantity($data['quantity']);
            $sale->setSaleDate($saleDate);
    
            // Validaciones antes de setear valores opcionales
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
    
            if ($product->getProductPhoto() !== null) {
                $sale->setProductPhoto($product->getProductPhoto());
            }
    
            if ($product->getBarcode() !== null) {
                $sale->setBarcode($product->getBarcode());
            }
    
            $entityManager->persist($sale);
        }
    
        $entityManager->persist($product);
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

        $entityManager->remove($sale);
        $entityManager->flush();

        return $this->json(['message' => 'Sale deleted successfully'], Response::HTTP_OK);
    }
}
