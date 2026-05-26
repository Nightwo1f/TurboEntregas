# RouteSnap Delivery App

Aplicativo mobile para capturar fotos de etiquetas/encomendas, extrair endereços automaticamente por OCR, armazenar os destinos e gerar a melhor rota a partir da localização atual do usuário, exibindo todas as paradas no mapa com alfinetes.

Observação importante: Waze pode ser usado via deep link/SDK para abrir navegação, mas para otimizar múltiplas paradas o caminho mais seguro é Google Maps Routes/Route Optimization API. A Routes API possui otimização de waypoints, e o ML Kit Text Recognition pode extrair texto das fotos. Consulte a documentação oficial do [Waze](https://developers.google.com/waze).

## 1. Objetivo do app

O usuário tira ou envia fotos contendo o endereço do destinatário.
O app armazena temporariamente essas fotos, extrai os endereços, valida os locais no mapa e monta uma rota otimizada para passar por todos os destinos no menor tempo possível.

Usuários comuns podem planejar rotas com até 10 endereços por vez.
Usuários VIP podem enviar até 50 fotos antes da análise final e gerar rotas completas com até 50 paradas.

## 2. Regras principais

### Usuário comum

- Login obrigatório.
- Pode enviar até 10 fotos por lote.
- Pode analisar até 10 endereços por rota.
- Pode gerar rota com até 10 paradas.
- Pode usar tema claro e escuro.

### Usuário VIP

- Login obrigatório.
- Pode enviar até 50 fotos no total.
- Pode enviar em partes: 10 fotos agora, depois mais 10, até completar 50.
- A análise dos endereços só acontece ao clicar em "Finalizar".
- Pode gerar rota completa com até 50 paradas.
- Pode salvar histórico de rotas.

## 3. Stack recomendada

### Mobile

- React Native com Expo
- TypeScript
- Expo Camera
- Expo Image Picker
- Expo Location
- React Navigation
- Zustand ou Redux Toolkit para estado global
- React Native Paper ou NativeWind para UI moderna

### Backend

- Node.js
- NestJS ou Express
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT para autenticação
- bcrypt para senha
- Redis opcional para filas/cache

### Serviços externos

- Google ML Kit ou Google Vision API para OCR
- Google Maps Geocoding API para transformar endereço em coordenadas
- Google Maps Routes API ou Route Optimization API para otimizar rota
- Waze Deep Links para abrir navegação externa no Waze, se desejado

## 4. Funcionalidades obrigatórias

### Autenticação

- Cadastro de usuário
- Login
- Logout
- Recuperação de senha
- Proteção de rotas autenticadas
- Campo `isVip` no usuário

### Upload/captura de fotos

- Tirar foto pela câmera
- Selecionar imagem da galeria
- Pré-visualizar fotos antes de finalizar
- Remover foto individual
- Contador de fotos
- Limite dinâmico:
  - comum: 10 fotos
  - VIP: 50 fotos

### Fluxo de lotes

O usuário VIP pode:

1. Tirar 10 fotos.
2. Salvar no lote atual.
3. Tirar mais 10 depois.
4. Repetir até no máximo 50.
5. Clicar em "Finalizar".
6. Só então o app faz OCR, extrai endereços e cria rota.

### OCR e extração de endereço

- Ao clicar em "Finalizar", enviar imagens para análise.
- Extrair texto das fotos.
- Identificar possível endereço.
- Permitir correção manual do endereço.
- Validar endereço com geocoding.
- Salvar endereço, latitude e longitude.

### Mapa e rota

- Obter localização atual do usuário.
- Mostrar origem no mapa.
- Mostrar cada endereço com alfinete.
- Calcular ordem ideal das paradas.
- Exibir rota no mapa.
- Exibir lista ordenada de paradas.
- Mostrar distância total e tempo estimado.
- Botão "Abrir no Waze" ou "Abrir no Google Maps".

### Sistema VIP

- Tela de planos
- Status do plano
- Bloqueio visual ao atingir limite comum
- Campo de assinatura:
  - `FREE`
  - `VIP`
- Backend deve validar o limite, não apenas o app.

### Temas

- Tema claro
- Tema escuro
- Alternância manual
- Salvar preferência do usuário
- Interface clean, moderna, com cards, botões arredondados e layout simples

## 5. Estrutura sugerida do projeto

```txt
routesnap-app/
  mobile/
    src/
      app/
      screens/
        LoginScreen.tsx
        RegisterScreen.tsx
        HomeScreen.tsx
        CameraScreen.tsx
        BatchScreen.tsx
        ReviewAddressesScreen.tsx
        MapRouteScreen.tsx
        VipScreen.tsx
        SettingsScreen.tsx
      components/
        PhotoCard.tsx
        AddressCard.tsx
        RouteStopCard.tsx
        ThemeToggle.tsx
      services/
        api.ts
        authService.ts
        photoService.ts
        routeService.ts
      store/
        authStore.ts
        batchStore.ts
        themeStore.ts
      theme/
        light.ts
        dark.ts

  backend/
    src/
      modules/
        auth/
        users/
        photos/
        batches/
        ocr/
        routes/
        subscriptions/
      prisma/
      common/
      main.ts
    prisma/
      schema.prisma
```

## 6. Modelagem do banco

### User

```ts
id: string;
name: string;
email: string;
passwordHash: string;
plan: "FREE" | "VIP";
createdAt: Date;
updatedAt: Date;
```

### PhotoBatch

```ts
id: string;
userId: string;
status: "OPEN" | "PROCESSING" | "DONE" | "CANCELLED";
maxPhotos: number;
createdAt: Date;
updatedAt: Date;
```

### Photo

```ts
id: string;
batchId: string;
imageUrl: string;
ocrText?: string;
extractedAddress?: string;
createdAt: Date;
```

### Address

```ts
id: string;
batchId: string;
photoId: string;
rawText: string;
address: string;
latitude: number;
longitude: number;
isConfirmed: boolean;
orderIndex?: number;
createdAt: Date;
```

### RoutePlan

```ts
id: string;
userId: string;
batchId: string;
originLatitude: number;
originLongitude: number;
totalDistanceMeters: number;
totalDurationSeconds: number;
createdAt: Date;
```

## 7. Fluxo principal do app

1. Usuário faz login.
2. App identifica se usuário é FREE ou VIP.
3. Usuário cria ou continua um lote de fotos.
4. Usuário tira fotos dos endereços.
5. App mostra contador:
   - FREE: 0/10
   - VIP: 0/50
6. Usuário pode remover fotos erradas.
7. Usuário clica em "Finalizar".
8. Backend valida limite do plano.
9. Backend executa OCR nas imagens.
10. Backend extrai possíveis endereços.
11. Backend geocodifica os endereços.
12. App mostra tela de revisão.
13. Usuário corrige endereços se necessário.
14. Usuário confirma.
15. App pega localização atual.
16. Backend/API de rotas calcula a melhor ordem.
17. App mostra mapa com alfinetes e rota.
18. Usuário inicia navegação externa.

## 8. Ordem de desenvolvimento

### Etapa 1: Base do projeto

- Criar monorepo com `mobile` e `backend`.
- Configurar TypeScript.
- Configurar ESLint/Prettier.
- Criar README inicial.
- Criar `.env.example`.

### Etapa 2: Backend inicial

- Criar API Node.js.
- Configurar PostgreSQL.
- Configurar Prisma.
- Criar tabelas principais.
- Criar autenticação JWT.
- Criar cadastro e login.

### Etapa 3: App mobile inicial

- Criar projeto React Native/Expo.
- Criar navegação.
- Criar telas de login/cadastro.
- Integrar login com backend.
- Salvar token localmente.

### Etapa 4: Tema e UI

- Criar tema claro e escuro.
- Criar componentes base.
- Criar tela Home.
- Criar layout moderno com cards e botões limpos.

### Etapa 5: Captura de fotos

- Integrar câmera.
- Permitir selecionar imagem da galeria.
- Criar tela de lote.
- Criar contador de fotos.
- Criar regra FREE/VIP no app.

### Etapa 6: Backend de lotes

- Criar endpoint para criar lote.
- Criar endpoint para adicionar foto.
- Criar endpoint para listar fotos do lote.
- Criar endpoint para remover foto.
- Validar limite no backend.

### Etapa 7: OCR

- Integrar serviço de OCR.
- Salvar texto bruto extraído.
- Criar parser inicial de endereço.
- Retornar endereços prováveis.

### Etapa 8: Revisão de endereços

- Criar tela de revisão.
- Permitir editar endereço.
- Permitir excluir endereço inválido.
- Confirmar lista final.

### Etapa 9: Geocoding

- Integrar Google Maps Geocoding API.
- Converter endereço em latitude/longitude.
- Salvar coordenadas.
- Tratar endereços não encontrados.

### Etapa 10: Otimização da rota

- Obter localização atual.
- Enviar origem e destinos para backend.
- Usar API de rotas com otimização de waypoints.
- Receber ordem ideal das paradas.
- Salvar rota planejada.

### Etapa 11: Mapa

- Mostrar mapa.
- Marcar origem.
- Marcar cada parada com alfinete.
- Desenhar rota.
- Mostrar lista ordenada das entregas.

### Etapa 12: Navegação externa

- Criar botão "Abrir no Google Maps".
- Criar botão "Abrir no Waze".
- Para Waze, usar deep link com destino selecionado.
- Para rota completa, manter app como planejador e abrir navegação parada por parada.

### Etapa 13: VIP

- Criar tela de planos.
- Criar status FREE/VIP.
- Criar bloqueios visuais.
- Criar validação no backend.
- Preparar integração futura com pagamento.

### Etapa 14: Testes e refinamento

- Testar login.
- Testar limite FREE.
- Testar limite VIP.
- Testar lote parcial de 10 + 10 + 10.
- Testar OCR com fotos ruins.
- Testar correção manual.
- Testar rota com 3, 10 e 50 endereços.
- Testar tema claro/escuro.

## 9. Endpoints sugeridos

```txt
POST /auth/register
POST /auth/login
GET /users/me

POST /batches
GET /batches/open
POST /batches/:id/photos
GET /batches/:id/photos
DELETE /photos/:id

POST /batches/:id/finalize
GET /batches/:id/addresses
PATCH /addresses/:id
DELETE /addresses/:id

POST /routes/plan
GET /routes/:id

GET /subscriptions/status
POST /subscriptions/mock-vip
```

## 10. Regras de validação

- Usuário precisa estar autenticado.
- Usuário FREE não pode passar de 10 fotos por lote.
- Usuário VIP não pode passar de 50 fotos por lote.
- O backend deve validar o limite sempre.
- Não executar OCR antes do usuário clicar em "Finalizar".
- Endereço sem coordenada não deve entrar na rota.
- Usuário deve poder corrigir endereço antes de gerar rota.

## 11. Variáveis de ambiente

```env
DATABASE_URL=
JWT_SECRET=
GOOGLE_MAPS_API_KEY=
OCR_PROVIDER=google_mlkit_or_vision
STORAGE_PROVIDER=local_or_s3
```

## 12. Observação sobre Waze

O app não deve depender do banco de dados interno do Waze para montar a rota, pois isso não é uma API pública comum para otimização completa de múltiplas paradas.

Estratégia recomendada:

- Usar Google Maps/Routes para geocoding, mapa e otimização.
- Usar Waze apenas como opção para abrir navegação externa até uma parada.
- O app deve funcionar mesmo sem o Waze instalado.

## 13. MVP obrigatório

A primeira versão deve conter:

- Login/cadastro
- Tema claro/escuro
- Captura de fotos
- Lote de até 10 fotos para FREE
- Lote de até 50 fotos para VIP
- Finalização manual do lote
- OCR
- Revisão/correção dos endereços
- Mapa com alfinetes
- Rota otimizada
- Botão para abrir navegação externa

## 14. Nome provisório

RouteSnap

Outras opções:

- EntregaRápida
- FotoRota
- RotaFlash
- SnapRoute
- RotaPin

