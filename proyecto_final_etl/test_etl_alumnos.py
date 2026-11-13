import unittest
from etl_alumnos import asignar_estado_academico, asignar_condicion_beca


class TestCamposCalculados(unittest.TestCase):
    def test_estado_academico_casos_normales(self):
        """Valida los rangos estándar de estado_academico."""
        self.assertEqual(asignar_estado_academico(18.5), "Destacado")
        self.assertEqual(asignar_estado_academico(13.0), "Regular")
        self.assertEqual(asignar_estado_academico(7.5), "Riesgo academico")

    def test_estado_academico_casos_borde(self):
        """Valida los valores límite exactos (16.0, 10.5, 0 y 20)."""
        self.assertEqual(asignar_estado_academico(16.0), "Destacado")
        self.assertEqual(asignar_estado_academico(15.99), "Regular")
        self.assertEqual(asignar_estado_academico(10.5), "Regular")
        self.assertEqual(asignar_estado_academico(10.49), "Riesgo academico")
        self.assertEqual(asignar_estado_academico(0.0), "Riesgo academico")
        self.assertEqual(asignar_estado_academico(20.0), "Destacado")

    def test_condicion_beca_casos_normales(self):
        """Valida las combinaciones estándar de promedio y créditos."""
        self.assertEqual(asignar_condicion_beca(18.0, 20), "Beca Completa")
        self.assertEqual(asignar_condicion_beca(16.2, 16), "Media Beca")
        self.assertEqual(asignar_condicion_beca(12.0, 18), "Sin Beneficio")

    def test_condicion_beca_casos_borde(self):
        """Valida los umbrales exactos de beca (17.0 con 18 créditos y 15.5)."""
        # Límite exacto para Beca Completa
        self.assertEqual(asignar_condicion_beca(17.0, 18), "Beca Completa")
        # Tiene promedio >= 17, pero le falta 1 crédito -> cae a Media Beca
        self.assertEqual(asignar_condicion_beca(17.5, 17), "Media Beca")
        # Límite exacto para Media Beca
        self.assertEqual(asignar_condicion_beca(15.5, 10), "Media Beca")
        # Justo debajo del límite de Media Beca
        self.assertEqual(asignar_condicion_beca(15.49, 22), "Sin Beneficio")


if __name__ == "__main__":
    unittest.main()
