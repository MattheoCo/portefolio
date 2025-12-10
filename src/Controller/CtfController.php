<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CtfController extends AbstractController
{
    #[Route('/ctf', name: 'app_ctf')]
    public function index(): Response
    {
        return $this->render('ctf/index.html.twig');
    }

    #[Route('/ctf/login', name: 'app_ctf_login')]
    public function login(): Response
    {
        return $this->render('ctf/login.html.twig');
    }

    #[Route('/ctf/terminal', name: 'app_ctf_terminal')]
    public function terminal(): Response
    {
        return $this->render('ctf/terminal.html.twig');
    }
}
