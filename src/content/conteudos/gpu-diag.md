---
title: "Diagnóstico: GPU com Artefatos Visuais"
description: "Guia passo-a-passo para identificar se o problema é VRAM ou Solda BGA."
category: "hardware"
tags: ["gpu", "repair", "vram"]
publishDate: 2024-02-14
author: "Lead Tech"
---

# Sintomas

1. Pixels coloridos aleatórios na tela.
2. Crash ao executar cargas 3D.
3. Tela azul (BSOD) com erro `VIDEO_TDR_FAILURE`.

## Ferramentas Necessárias

- Multímetro
- Software Mats/Mods (Nvidia)
- Estação de Retrabalho

## Procedimento

1. **Inspeção Visual**: Verifique capacitores estufados ou danos físicos.
2. **Teste de Tensão**: Meça as fases de alimentação da GPU e Memória.
3. **Teste de VRAM**: Execute o Mats para identificar qual chip de memória está falhando.
