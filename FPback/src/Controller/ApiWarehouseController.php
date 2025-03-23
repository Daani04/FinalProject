<?php

namespace App\Controller;

use App\Entity\Warehouse;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/warehouse', name: 'api_warehouse_')]
class ApiWarehouseController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $entityManager): JsonResponse
    {
        $warehouses = $entityManager->getRepository(Warehouse::class)->findAll();
        $data = [];

        foreach ($warehouses as $warehouse) {
            $data[] = [
                'id' => $warehouse->getId(),
                'user_id' => $warehouse->getUser()->getId(),
                'name' => $warehouse->getName(),
                'location' => $warehouse->getLocation(),
            ];
        }

        return $this->json($data);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['name'], $data['location'], $data['user_id'])) {
            return $this->json(['error' => 'Missing required fields'], 400);
        }

        // Verificar que el usuario exista antes de asignarlo al Warehouse
        $user = $entityManager->getRepository(User::class)->find($data['user_id']);
        if (!$user) {
            return $this->json(['error' => 'User not found'], 404);
        }

        $warehouse = new Warehouse();
        $warehouse->setName($data['name']);
        $warehouse->setLocation($data['location']);
        $warehouse->setUser($user);

        $entityManager->persist($warehouse);
        $entityManager->flush();

        return $this->json(['message' => 'Warehouse created successfully'], 201);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $warehouse = $entityManager->getRepository(Warehouse::class)->find($id);

        if (!$warehouse) {
            return $this->json(['error' => 'Warehouse not found'], 404);
        }

        $entityManager->remove($warehouse);
        $entityManager->flush();

        return $this->json(['message' => 'Warehouse deleted successfully'], 200);
    }
}
