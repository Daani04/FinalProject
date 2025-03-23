<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api/user', name: 'api_user_')]
class ApiUserController extends AbstractController {
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $entityManager): JsonResponse
    {
        $users = $entityManager->getRepository(User::class)->findAll();
        $data = [];

        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'username' => $user->getUserName(),
                'email' => $user->getEmail(),
                'password' => $user->getPassword(),
                'company' => $user->getCompanyName(),
                'role' => $user->getRole(),
            ];
        }

        return $this->json($data);
    }

    #[Route('/login', name: 'login', methods: ['POST'])]
    public function login(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        if (!isset($data['email'], $data['password'])) {
            return $this->json(['error' => 'Missing email or password'], 400);
        }

        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => $data['email']]);

        if (!$user || !password_verify($data['password'], $user->getPassword())) {
            return $this->json(['error' => 'Invalid credentials'], 401);
        }

        return $this->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->getId(),
                'username' => $user->getUserName(),
                'email' => $user->getEmail(),
                'role' => $user->getRole(),
            ]
        ]);
    }

    #[Route('', name: 'create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse //El request nos permite capturar los datos que envia el postman, es necesario porque a diferencia del delete que solo recibe un id aqui recibimos un json entero
    {
        $data = json_decode($request->getContent(), true); //json_decode se encarga de convertir un json a un array cogiendo los datos del $request y medinate el true diciendole que quiero que se convierta en un array

        if (!isset($data['username'], $data['email'], $data['password'], $data['company'], $data['role'])) {
            return $this->json(['error' => 'Missing required fields'], 400);
        }

        $user = new User();
        $user->setUserName($data['username']);
        $user->setEmail($data['email']);
        $user->setPassword(password_hash($data['password'], PASSWORD_DEFAULT));
        $user->setCompanyName($data['company']);
        $user->setRole($data['role']);

        $entityManager->persist($user);
        $entityManager->flush();

        return $this->json(['message' => 'User created successfully'], 201);
    }

    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse {
        if (!isset($id)) {
            return $this->json(['error' => 'Missing required fields'], 400);
        }

        $user = $entityManager->getRepository(User::class)->find($id); //El (user::class) la traduccion de ("App\Entity\User"), su funcion es sabe en que tabla de la base de datos ejecutar el find($id)
        $entityManager->remove($user);
        $entityManager->flush();
        return $this->json(['message' => 'User deleted successfully'], 200); //Si no se devuelve un mensaje al eliminar el usuario da un error, aunque se elimina de todas formas
    }
}
